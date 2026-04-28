# Writing data

This is going to be similar to Exercise 2, but this time, you'll actually log in and post — i.e., create new records on the network.

Here, in `src/index.ts`, we have another little script:

```ts
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
```

Some of this — like the use of `Client`, and the API calls — should be recognizable from the last exercise. This time, however, we're adding a login step, meaning that we're able to run `client.create()` commands to actually write new records!

One thing to note is that this isn't very different from reading existing records — it's a lot like the different between an HTTP GET and a POST. Reading and writing are similar API calls.

To run this script, first install packages with `npm` from this directory:

```bash
cd /workspace/exercises/3-writes
npm i
```

Then, run the script with:

```bash
npx tsx src/index.ts your-username your-password
```

Now, don't worry — by default, this isn't going to create new Bluesky posts. Instead, we're defaulting to a different record Lexicon — `xyz.statusphere.status` instead of `app.bsky.feed.post`. This is used for toy examples, and won't be picked up by any real-world apps.

This should produce a result like:

```
{
  uri: 'at://did:plc:vmt7o7y6titkqzzxav247zrn/xyz.statusphere.status/3mgbdr5jiqf2p',
  cid: 'bafyreidbqmykcc3q2awfuaar7sxjguqfnuq4oyqarbeajwqlnlbqrejtcu',
  commit: {
    cid: 'bafyreigvagsw5vzvvjcfryppiozfun4dk3afuqy6lwgmzzq6jkanacrvbu',
    rev: '3mgbdr5jpl52p'
  },
  validationStatus: 'unknown'
}
```

As usual, we can pop that at:// URI into a browser that supports browsing AT records to see what it looks like on the PDS side: https://pdsls.dev/at://did:plc:vmt7o7y6titkqzzxav247zrn/xyz.statusphere.status/3mgbdr5jiqf2p.

We created a record with these contents: 🍕

If you wanted to use this app to actually post for real, just add some additional arguments!

```bash
npx tsx src/index.ts your-username your-password bsky "wow I love this great workshop by @alex.bsky.team"`
```

Note: I am not responsible for you spamming your followers.