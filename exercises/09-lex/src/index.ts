import { Client } from '@atproto/lex'
import type { AtIdentifierString } from '@atproto/syntax'
import * as app from './lexicons/app.js'

const appviewClient = new Client('https://public.api.bsky.app')
const pdsClient = new Client('https://bsky.social')

const args = process.argv.slice(2)
const actor = (args[0] ?? 'alex.bsky.team') as AtIdentifierString
const command = args[1] ?? 'profile'

async function main() {
    if (command === 'posts') {
        const posts = await pdsClient.list(app.bsky.feed.post, { limit: 10, repo: actor })
        console.log(posts);
    } else {
        const profile = await appviewClient.call(app.bsky.actor.getProfile, { actor })
        console.log(profile);
    }
}

main()