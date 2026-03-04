# Getting data from the firehose

In this case, we'll start out by looking at some raw protocol data.

We'll be using *Jetstream* endpoints rather than *Firehose* endpoints. These are pretty similar — they're both broadcast from Relays and contain all the records on the network. The difference is that the Firehose includes some data that's difficult to work with on the command line in an exercise like this, whereas the Jetstream is all JSON. You can read more about this at https://atproto.com/guides/streaming-data.

`websocat` is a CLI tool for streaming data from websockets. Let's use it with a jetstream endpoint:

```bash
websocat wss://jetstream1.us-east.bsky.network/subscribe
```

That's a lot of data! You can press Ctrl+C to stop the process running in that terminal. Now, let's pipe the output through `jq` and `less` so we can navigate around it:

```bash
websocat wss://jetstream1.us-east.bsky.network/subscribe | jq . --unbuffered | less
```

OK, now you're getting a feel for the protocol. Go ahead and run this additional command to extract a URL from that output so you can view it in a browser:

```bash
websocat wss://jetstream1.us-east.bsky.network/subscribe \
  | jq -r --unbuffered 'select(.kind == "commit" and .commit.collection == "app.bsky.feed.post") | .did + "/" + .commit.collection + "/" + .commit.rkey' \
  | head -n 1 \
  | xargs -I {} open "https://pdsls.dev/at://{}"
```

Now we're cooking. Here you'll see the full at:// URI structure, as well as what's included in AT records. In this case, we deliberately picked out an `app.bsky.feed.post` record to open in a browser, but there are lots of other Lexicons on the protocol — the *vast* majority of records on the network are actually Bluesky *likes*, but there are Lexicons published by other apps too!

Navigate around a bit (either in the browser or on the command line) to get a feel for them. Anything interesting you're noticing?