# Getting backlinks

In the last exercise, you saw how records are stored on a PDS. But what if you want to find *all the records that reference a particular record*? For example, all the likes on a post, or all the replies to it?

One approach would be to backfill the entire network and query your local database (we'll do that in exercise 6). But that's heavyweight — you'd need to store terabytes of data.

**Backlinks** offer a lighter-weight solution. A backlink service indexes the network and lets you query for records that *point to* a given URI, without storing everything yourself.

## Looking at a post

Let's start by looking at a specific post. Open this URL in your browser:

https://pdsls.dev/at://did:plc:a4pqq234yw7fqbddawjo7y35/app.bsky.feed.post/3m237ilwc372e

This is a post record stored on someone's PDS. Take a moment to look at the structure — you'll see the `text` field with the post content, a `createdAt` timestamp, and maybe some other fields like `embed` or `facets`.

Now, this post probably has some likes and replies. But where are they? They're not *in* this record — likes and replies are separate records stored on *other people's* PDSes, each containing a reference back to this post's URI.

So how do we find them?

## Using Constellation

[Constellation](https://constellation.microcosm.blue) is a community backlinks service run by Microcosm. It indexes the network and tracks which records point to which other records.

Let's use it to find all the likes on that post. Open this URL in your browser:

https://constellation.microcosm.blue/xrpc/blue.microcosm.links.getBacklinks?subject=at%3A%2F%2Fdid%3Aplc%3Aa4pqq234yw7fqbddawjo7y35%2Fapp.bsky.feed.post%2F3m237ilwc372e&source=app.bsky.feed.like%3Asubject.uri&limit=16

Constellation's web interface will render the results in a readable format. You should see a list of like records that point to our original post. Each entry shows:
- The AT URI of the like record itself
- The path within the record that contains the reference (`subject.uri`)

Pick one of those links and click through on `browse record`. Look at the like record's structure. You'll see a `subject` field containing the URI of the post it's liking — that's the link that Constellation indexed!

## Querying from the command line

You can also query Constellation from the command line. Let's break down the URL to see what we're asking for:

```bash
curl -s -H "Accept: application/json" \
  "https://constellation.microcosm.blue/xrpc/blue.microcosm.links.getBacklinks?\
subject=at%3A%2F%2Fdid%3Aplc%3Aa4pqq234yw7fqbddawjo7y35%2Fapp.bsky.feed.post%2F3m237ilwc372e&\
source=app.bsky.feed.like%3Asubject.uri&\
limit=16" \
  | jq .
```

The key parameters are:
- `subject`: The AT URI you want backlinks *to* (URL-encoded — the `%3A` and `%2F` are just `:` and `/`)
- `source`: The record type and field path to search — here it's `app.bsky.feed.like:subject.uri`
- `limit`: How many results to return

The JSON response will have a `records` array containing the matching records.

## Finding replies

Likes aren't the only records that reference posts. Let's find replies instead. The difference is in the `source` parameter — instead of looking for likes, we look for posts where the reply field points to our target:

```bash
curl -s -H "Accept: application/json" \
  "https://constellation.microcosm.blue/xrpc/blue.microcosm.links.getBacklinks?\
subject=at%3A%2F%2Fdid%3Aplc%3Aa4pqq234yw7fqbddawjo7y35%2Fapp.bsky.feed.post%2F3m237ilwc372e&\
source=app.bsky.feed.post%3Areply.parent.uri&\
limit=16" \
  | jq .
```

Compare the `source` parameter:
- **Likes:** `app.bsky.feed.like:subject.uri`
- **Replies:** `app.bsky.feed.post:reply.parent.uri`

This tells Constellation to look for `app.bsky.feed.post` records where the `reply.parent.uri` field matches our target — in other words, direct replies.

## When to use backlinks vs. backfilling

| Approach | Pros | Cons |
|----------|------|------|
| **Backlinks** | Lightweight, no storage needed, real-time | Dependent on external service |
| **Backfilling** | Full control, works offline, custom indexing | Storage-intensive, sync lag |

Backlinks are great for simple lookups — finding who liked, replied to, or reposted something. Backfilling (which we'll explore in the next exercise) is better when you need complex queries, want to guarantee availability, or need to process records in bulk.

What other kinds of relationships might you want to query with backlinks? Think about follows, blocks, list memberships, or even custom record types from non-Bluesky apps.
