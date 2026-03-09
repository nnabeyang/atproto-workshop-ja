import { AtUriString, DidString } from '@atproto/lex'
import { LexError, LexRouter, serviceAuth } from '@atproto/lex-server'
import { serve } from '@atproto/lex-server/nodejs'
import { Tap, SimpleIndexer } from '@atproto/tap'
import * as app from './lexicons/app.js'

// =============================================================================
// Configuration
// =============================================================================

interface FeedConfig {
    publisherDid: DidString
    feedName: string
    searchTerms: string[]
    maxPosts: number
    port: number
    tapUrl: string
    tapPassword: string
    initialRepos: string[]
}

const args = process.argv.slice(2)
const DEFAULT_REPO = args[0] ?? 'did:plc:ragtjsm2j2vknwkz3zp4oxrd' // pfrazee.com

const config: FeedConfig = {
    publisherDid: (process.env.FEED_PUBLISHER_DID || 'did:example:alice') as DidString,
    feedName: process.env.FEED_NAME || 'whats-alf',
    searchTerms: (process.env.FEED_SEARCH_TERMS || 'alf').split(',').map(s => s.trim()),
    maxPosts: parseInt(process.env.FEED_MAX_POSTS || '1000', 10),
    port: parseInt(process.env.FEED_PORT || '3000', 10),
    tapUrl: process.env.TAP_URL || 'http://localhost:2480',
    tapPassword: process.env.TAP_PASSWORD || 'secret',
    initialRepos: (process.env.FEED_INITIAL_REPOS || DEFAULT_REPO).split(',').map(s => s.trim()),
}

const FEED_URI: AtUriString = `at://${config.publisherDid}/app.bsky.feed.generator/${config.feedName}` as AtUriString

// =============================================================================
// Post Index
// =============================================================================

interface IndexedPost {
    uri: AtUriString
    indexedAt: number
}

const postIndex: IndexedPost[] = []

const searchPattern = new RegExp(
    `\\b(${config.searchTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
    'i'
)

// =============================================================================
// Tap Indexer
// =============================================================================

const tap = new Tap(config.tapUrl, { adminPassword: config.tapPassword })
const indexer = new SimpleIndexer()

indexer.record(async (evt) => {
    if (evt.collection !== 'app.bsky.feed.post') return

    const uri = `at://${evt.did}/${evt.collection}/${evt.rkey}` as AtUriString

    if (evt.action === 'delete') {
        const idx = postIndex.findIndex(p => p.uri === uri)
        if (idx !== -1) {
            postIndex.splice(idx, 1)
            console.log(`DELETE ${uri}`)
        }
        return
    }

    const text = (evt.record?.text as string) || ''
    if (!searchPattern.test(text)) return
    if (postIndex.some(p => p.uri === uri)) return

    postIndex.unshift({ uri, indexedAt: Date.now() })
    if (postIndex.length > config.maxPosts) postIndex.pop()

    const preview = text.substring(0, 60).replace(/\n/g, ' ')
    console.log(`${evt.action.toUpperCase()} ${uri}`)
    console.log(`  "${preview}${text.length > 60 ? '...' : ''}"`)
    console.log(`  ⭐ Added to index (${postIndex.length} total)`)
})

indexer.identity(async (evt) => {
    if (evt.status === 'active') return
    // Remove posts from disabled/deleted identities
    const removed = postIndex.filter(p => p.uri.includes(evt.did)).length
    if (removed > 0) {
        postIndex.splice(0, postIndex.length, ...postIndex.filter(p => !p.uri.includes(evt.did)))
        console.log(`Identity ${evt.did} (${evt.status}): removed ${removed} posts`)
    }
})

indexer.error((err) => console.error('Indexer error:', err))

const channel = tap.channel(indexer)

// =============================================================================
// Feed Generator Server
// =============================================================================

// Auth is optional for this demo since we only log the requester's DID.
// In production, you may want to use credentials to personalize the feed.
const auth = serviceAuth({
    audience: config.publisherDid,
    unique: async () => true,
})

const router = new LexRouter()

router.add(app.bsky.feed.describeFeedGenerator, {
    auth,
    handler: (ctx) => {
        console.log('describeFeedGenerator from', ctx.credentials?.did)
        return {
            body: {
                did: config.publisherDid,
                feeds: [app.bsky.feed.describeFeedGenerator.feed.$build({ uri: FEED_URI })],
                links: {
                    privacyPolicy: 'https://example.com/privacy',
                    termsOfService: 'https://example.com/tos',
                },
            },
        }
    },
})

router.add(app.bsky.feed.getFeedSkeleton, {
    auth,
    handler: (ctx) => {
        if (ctx.params.feed !== FEED_URI) {
            throw new LexError('InvalidRequest', 'Feed not found')
        }
        console.log('getFeedSkeleton from', ctx.credentials?.did)

        const limit = Math.min(ctx.params.limit ?? 50, 100)
        const cursor = ctx.params.cursor as string | undefined

        let startIdx = 0
        if (cursor) {
            const cursorTime = parseInt(cursor, 10)
            startIdx = postIndex.findIndex(p => p.indexedAt < cursorTime)
            if (startIdx === -1) startIdx = postIndex.length
        }

        const slice = postIndex.slice(startIdx, startIdx + limit)
        const feed = slice.map(p => app.bsky.feed.defs.skeletonFeedPost.$build({ post: p.uri }))
        const lastPost = slice.at(-1)
        const nextCursor = lastPost && slice.length === limit && startIdx + limit < postIndex.length
            ? lastPost.indexedAt.toString()
            : undefined

        return { body: { feed, cursor: nextCursor } }
    },
})

// =============================================================================
// Start
// =============================================================================

channel.start()
console.log('Indexer connected to Tap server')

if (config.initialRepos.length > 0) {
    tap.addRepos(config.initialRepos).then(() => {
        console.log(`Added ${config.initialRepos.length} repo(s) to follow\n`)
    })
}

serve(router, { port: config.port }).then((server) => {
    const feedParam = encodeURIComponent(FEED_URI)

    console.log(`
Feed Generator Running

Server: http://localhost:${config.port}
Feed: ${config.feedName}
Terms: ${config.searchTerms.join(', ')}
Tap: ${config.tapUrl}
Repos: ${config.initialRepos.length}

To test (generate a JWT with goat):
goat account service-auth --aud ${config.publisherDid}

Then:
curl -H "Authorization: Bearer <jwt>" "http://localhost:${config.port}/xrpc/app.bsky.feed.getFeedSkeleton?feed=${feedParam}"

Listening for posts matching: ${config.searchTerms.join(', ')}
`)

    const shutdown = async () => {
        console.log('Shutting down...')
        await channel.destroy()
        await server.terminate()
        process.exit(0)
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
})
