import { Client } from '@atproto/lex'
import type { AtIdentifierString } from '@atproto/syntax'
import * as app from './lexicons/app.js'

const appviewClient = new Client('https://public.api.bsky.app')
const pdsClient = new Client('https://bsky.social')

const args = process.argv.slice(2)

const DEFAULT_ACTOR: AtIdentifierString = 'alex.bsky.team';
const CMD_POSTS = 'posts';

const [actor, command] = args[0] === CMD_POSTS
    ? [DEFAULT_ACTOR, CMD_POSTS]
    : [(args[0] ?? DEFAULT_ACTOR) as AtIdentifierString, args[1]];

async function main() {
    if (command === CMD_POSTS) {
        const posts = await pdsClient.list(app.bsky.feed.post, { limit: 10, repo: actor })
        console.dir(posts, { depth: null });
    } else {
        const profile = await appviewClient.call(app.bsky.actor.getProfile, { actor })
        console.dir(profile, { depth: null });
    }
}

main()