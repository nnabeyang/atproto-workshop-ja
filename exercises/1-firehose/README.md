## Getting data from the firehose

```bash
websocat wss://jetstream1.us-east.bsky.network/subscribe
```

```bash
websocat wss://jetstream1.us-east.bsky.network/subscribe | jq . --unbuffered | less
```

```bash
websocat wss://jetstream1.us-east.bsky.network/subscribe \
  | jq -r --unbuffered 'select(.kind == "commit" and .commit.collection == "app.bsky.feed.post") | .did + "/" + .commit.collection + "/" + .commit.rkey' \
  | head -n 1 \
  | xargs -I {} open "https://pdsls.dev/at://{}"
```