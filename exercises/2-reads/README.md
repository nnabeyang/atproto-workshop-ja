# Reading data

OK, now we're going to do some individual reads over our HTTP API! Most of the ways you'll interact with AT records, other than the Jetstream websocket, are just HTTP calls, and here you'll see a functional example.

We've got a little script for interacting with our API without authenticating in `src/index.ts`. It looks like this:

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

To run this script, first install packages with `npm` from this directory:

```bash
cd /workspace/exercises/2-reads
npm i
```

Then, run the script with:

```bash
npx tsx src/index.ts
```

By default, you should get my Bluesky profile in the output:

```
{
  did: 'did:plc:vmt7o7y6titkqzzxav247zrn',
  handle: 'alex.bsky.team',
  displayName: 'Alex',
  avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:vmt7o7y6titkqzzxav247zrn/bafkreiaho53ylxsdwhsgc7zyh7t6l3q37xwkrdpzbbzx5zrlywztgspn4a@jpeg',
  associated: {
    lists: 0,
    feedgens: 0,
    starterPacks: 0,
    labeler: false,
    chat: { allowIncoming: 'following' },
    activitySubscription: { allowSubscriptions: 'followers' },
    germ: {
      showButtonTo: 'usersIFollow',
      messageMeUrl: 'https://landing.ger.mx/newUser'
    }
  },
  labels: [],
  createdAt: '2023-05-15T15:20:45.790Z',
  verification: {
    verifications: [ [Object] ],
    verifiedStatus: 'valid',
    trustedVerifierStatus: 'none'
  },
  description: 'the passive pasadena thrill | bsky devrel\n' +
    '\n' +
    'book a meeting: https://calendar.app.google/rNeqWSx2uMfzhQYV6',
  indexedAt: '2026-02-20T21:02:25.750Z',
  banner: 'https://cdn.bsky.app/img/banner/plain/did:plc:vmt7o7y6titkqzzxav247zrn/bafkreigvwsqd5vpvo7qg3prrbeudyg2jcnoburwsca3ahmelzehiumxzrm@jpeg',
  followersCount: 1256,
  followsCount: 699,
  postsCount: 1730,
  pinnedPost: {
    cid: 'bafyreideit7u37hyuhtgapiypl4wpgcenxif7l3bypplwkvjoknz4pujdq',
    uri: 'at://did:plc:vmt7o7y6titkqzzxav247zrn/app.bsky.feed.post/3lripmoyr3c2y'
  }
}
```

## Other ways to read data

You can also run it a couple of other ways! For example, try providing your own profile name as an additional argument:

```bash
npx tsx src/index.ts you.bsky.social
```

That should return your profile. In both of these cases, we're doing `client.call(app.bsky.actor.getProfile)`. You can also use this same script to get your 10 most recent posts instead, by adding a `posts` argument:

```bash
npx tsx src/index.ts you.bsky.social posts
```

This calls `client.list(app.bsky.feed.post)` instead. Feel free to copy these post URIs into a browser interface to get a better look at them. Anything interesting here?