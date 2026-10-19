# Lexicons

If you were present for the preceding workshop, one of our exercises involved reading from the network without authenticating.

We skipped a step when we were setting up that project earlier — installing Lexicons and generating code from them.

This directory has the same program as Exercise 2. Here's what `Sources/Reads/main.swift` looks like:

```swift
import Foundation
import SwiftAtproto

let appviewClient = Client("https://public.api.bsky.app")

let args = CommandLine.arguments.dropFirst()

let defaultActor = "alex.bsky.team"
let cmdPosts = "posts"

let (actor, command) =
  args.first == cmdPosts
  ? (defaultActor, cmdPosts)
  : (args.first ?? defaultActor, args.dropFirst().first)

/// Prints a response as indented JSON.
func printJSON(_ value: some Encodable) throws {
  let encoder = JSONEncoder()
  encoder.outputFormatting = [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes]
  print(String(decoding: try encoder.encode(value), as: UTF8.self))
}

if command == cmdPosts {
  let pdsClient = try await resolvePDS(actor, appview: appviewClient)
  let posts = try await pdsClient.RepoListRecords(
    collection: .init(rawValue: App.Bsky.FeedPost.nsId), limit: 10, repo: .init(rawValue: actor))
  try printJSON(posts)
} else {
  let profile = try await appviewClient.ActorGetProfile(actor: .init(rawValue: actor))
  try printJSON(profile)
}
```

This time, though, `Sources/Reads/Lexicon` is empty. If you try to build it, you'll get errors like these:

```bash
cd /workspace/exercises/09-lex
swift build
```

```
Sources/Reads/Client.swift:9:16: error: cannot find type 'XRPCCallable' in scope
Sources/Reads/Resolve.swift:17:29: error: value of type 'Client' has no member 'IdentityResolveHandle'
```

`XRPCCallable` and methods like `ActorGetProfile` and `IdentityResolveHandle` aren't written by hand — they're generated from Lexicons.

Our TypeScript SDK comes with a `lex` CLI that lets you resolve and install Lexicons published anywhere across the Atmosphere, so that you can call them in your project. Installing doesn't depend on the language you use, so we can use it from Swift too. Here, you can see we use `app.bsky.actor.getProfile`, `app.bsky.feed.post`, `com.atproto.repo.listRecords`, and `com.atproto.identity.resolveHandle`. That means that you can do:

```bash
lex install app.bsky.actor.getProfile app.bsky.feed.post com.atproto.repo.listRecords com.atproto.identity.resolveHandle
```

This finds each Lexicon from its NSID, along with every Lexicon those refer to, and saves them as JSON files in `lexicons/`. It also records what it installed in `lexicons.json`.

Next, generate Swift code from those files with [swift-atproto](https://github.com/nnabeyang/swift-atproto). Its settings are in `.atproto.json`, which reads every Lexicon in `lexicons/` and writes the code to `Sources/Reads/Lexicon`:

```json
{
  "generate": ["client"],
  "module": "Sources/Reads/Lexicon",
  "dependencies": [
    {
      "location": "file:.",
      "lexicons": [{ "path": "lexicons" }],
      "state": { "revision": "local" }
    }
  ]
}
```

Run its package plugin:

```bash
swift package --disable-experimental-prebuilts plugin \
  --allow-writing-to-package-directory \
  --allow-network-connections all:443 \
  swift-atproto
```

And that should resolve your missing types, and let you run the program as before:

```bash
swift run reads
```

Why the additional step? Because this lets us give first-class support to *all* Lexicons — including Lexicons that you might have just created yourself!
