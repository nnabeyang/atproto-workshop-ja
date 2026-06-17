# Lexicons

If you were present for the preceding workshop, one of our exercises involved reading from the network without authenticating.

We skipped a step when we were setting up that project earlier — installing and building Lexicons.

Here's the what source of that file looks like:

```ts
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
```

After doing an `npm i` to install dependencies, you might notice that you still have one broken import here — this line: `import * as app from './lexicons/app.js'`.

The way our Typescript SDK, `lex` works, is by allowing you to resolve, install, and build Lexicons published anywhere across the Atmosphere to call in your project. Here, you can see we use both `app.bsky.feed.post` and `app.bsky.actor.getProfile`. That means that you can do:

```bash
lex install app.bsky.feed.post app.bsky.actor.getProfile
lex build
```

And that should resolve your missing import, and let you run the script as before:

```bash
npx tsx src/index.ts
```

Why the additional step? Because this lets us give first-class support to *all* Lexicons — including Lexicons that you might have just created yourself!