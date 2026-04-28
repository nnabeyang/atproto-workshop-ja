# Backfilling

Now, to contrast with using backlinks, you're going to *backfill* some records. This is the heavier-weight solution — actually replicating AT records from the network to a local database so you can serve them.

This is a core principal of atproto — anyone can backfill a complete copy of the network, whether they want to use it for research or anything else. However, that would be a double-digit number of TB right now, not what we want for our exercise.

In this case, we're only going to backfill a relatively small set of records matching some criteria.

The first thing we'll do here is run `tap` — our tool for [backfilling records](https://atproto.com/guides/backfilling). `tap` is already installed in this workspace, so you'll just need to do `tap run` in one terminal:

```bash
tap run --disable-acks=true
```

Now, in another terminal, we'll run a sample feed generator architecture. Feed generators are a good use case for backfilling, because they require you to actually monitor the network, grab some records, then rebroadcast the ones you want to serve according to your feed algorithm.

To run this script, first install packages with `npm` from this directory:

```bash
cd /workspace/exercises/6-tap
npm i
```

Then, run the script with:

```bash
npx tsx src/index.ts 
```

You'll see the feed generator's startup output, and then some posts will be logged to your terminal!

```
Indexer connected to Tap server

Feed Generator Running

Server: http://localhost:3000
Feed: whats-alf
Terms: alf
Tap: http://localhost:2480
Repos: 1

To test (generate a JWT with goat):
goat account service-auth --aud did:example:alice

Then:
curl -H "Authorization: Bearer " "http://localhost:3000/xrpc/app.bsky.feed.getFeedSkeleton?feed=at%3A%2F%2Fdid%3Aexample%3Aalice%2Fapp.bsky.feed.generator%2Fwhats-alf"

Listening for posts matching: alf

Added 1 repo(s) to follow

CREATE at://did:plc:ragtjsm2j2vknwkz3zp4oxrd/app.bsky.feed.post/3jux6xlrdb42v
  "Run?? Alf was the date I struck out with ☹️"
  ⭐ Added to index (1 total)
CREATE at://did:plc:ragtjsm2j2vknwkz3zp4oxrd/app.bsky.feed.post/3jux7x2uvip2v
  "god is that okay? I'm really confused right now, Alf broke m..."
  ⭐ Added to index (2 total)
```

As before, you can change these arguments, if you want to broadcast a feed with some different search terms, from a different user's posts:

```bash
FEED_SEARCH_TERMS="Zangief" npx tsx src/index.ts "did:plc:vmt7o7y6titkqzzxav247zrn"
```

We won't get into the whole feed generator architecture in the time that we have today, but you can find a complete tutorial at https://atproto.com/guides/custom-feed-tutorial. Can you think of any other use cases for tap?