import { Client } from '@atproto/lex'
import type { DatetimeString } from '@atproto/syntax'
import { PasswordSession } from '@atproto/lex-password-session'
import * as app from './lexicons/app.js'
import * as xyz from './lexicons/xyz.js'

const args = process.argv.slice(2)
const username = args[0] ?? 'your-handle.bsky.social'
const password = args[1] ?? 'your-app-password'
const command = args[2] ?? 'statusphere'
const contents = args[3] ?? '🍕'

async function main() {
    const result = await PasswordSession.login({
        service: 'https://bsky.social', // or your PDS host
        identifier: username,
        password: password,
    })

    const client = new Client(result)
    const createdAt = (new Date().toISOString() as DatetimeString)

    if (command === 'bsky') {
        const posts = await client.create(app.bsky.feed.post, { text: contents, createdAt: createdAt })
        console.log(posts);
    } else {
        const profile = await client.create(xyz.statusphere.status, { status: contents, createdAt })
        console.log(profile);
    }
}

main()