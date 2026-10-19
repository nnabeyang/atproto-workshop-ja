# Reading data

OK, now we're going to do some individual reads over our HTTP API! Most of the ways you'll interact with AT records, other than the Jetstream websocket, are just HTTP calls, and here you'll see a functional example.

We've got a little Swift program for interacting with our API without authenticating in `Sources/Reads/main.swift`. It looks like this:

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

The methods it calls, such as `ActorGetProfile`, come from Swift code that [swift-atproto](https://github.com/nnabeyang/swift-atproto) generated from Lexicons and that lives in `Sources/Reads/Lexicon`. You'll generate code like this yourself in a later exercise.

To run this program, build and run it with `swift run` from this directory:

```bash
cd /workspace/exercises/02-reads
swift run reads
```

The first run takes a while, because it downloads and builds the dependencies. By default, you should get my Bluesky profile in the output:

```
{
  "associated" : {
    "activitySubscription" : {
      "allowSubscriptions" : "followers"
    },
    "chat" : {
      "allowIncoming" : "all"
    },
    "feedgens" : 0,
    "germ" : {
      "messageMeUrl" : "https://landing.ger.mx/newUser",
      "showButtonTo" : "usersIFollow"
    },
    "labeler" : false,
    "lists" : 0,
    "starterPacks" : 0
  },
  "avatar" : "https://cdn.bsky.app/img/avatar/plain/did:plc:vmt7o7y6titkqzzxav247zrn/bafkreiaho53ylxsdwhsgc7zyh7t6l3q37xwkrdpzbbzx5zrlywztgspn4a",
  "banner" : "https://cdn.bsky.app/img/banner/plain/did:plc:vmt7o7y6titkqzzxav247zrn/bafkreigvwsqd5vpvo7qg3prrbeudyg2jcnoburwsca3ahmelzehiumxzrm",
  "createdAt" : "2023-05-15T15:20:45.790Z",
  "description" : "the passive pasadena thrill | bsky devrel\n\nbook a meeting: https://calendar.app.google/rNeqWSx2uMfzhQYV6",
  "did" : "did:plc:vmt7o7y6titkqzzxav247zrn",
  "displayName" : "Alex",
  "followersCount" : 2072,
  "followsCount" : 923,
  "handle" : "alex.bsky.team",
  "indexedAt" : "2026-02-20T21:02:25.750Z",
  "labels" : [

  ],
  "pinnedPost" : {
    "cid" : "bafyreideit7u37hyuhtgapiypl4wpgcenxif7l3bypplwkvjoknz4pujdq",
    "uri" : "at://did:plc:vmt7o7y6titkqzzxav247zrn/app.bsky.feed.post/3lripmoyr3c2y"
  },
  "postsCount" : 3218,
  "verification" : {
    "trustedVerifierStatus" : "none",
    "verifications" : [
      {
        "createdAt" : "2025-12-01T19:28:19.103Z",
        "isValid" : true,
        "issuer" : "did:plc:z72i7hdynmk6r22z27h6tvur",
        "issuerDisplayName" : "Bluesky",
        "issuerHandle" : "bsky.app",
        "uri" : "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.graph.verification/3m6x5xorbfa2c"
      }
    ],
    "verifiedStatus" : "valid"
  }
}
```

## Other ways to read data

You can also run it a couple of other ways! For example, try providing your own handle as an additional argument, in place of `alice.example.com`:

```bash
swift run reads alice.example.com
```

That should return your profile. In both of these cases, we're calling `app.bsky.actor.getProfile` on the Bluesky AppView. You can also use this same program to get your 10 most recent posts instead, by adding a `posts` argument:

```bash
swift run reads alice.example.com posts
```

This calls `com.atproto.repo.listRecords` for the `app.bsky.feed.post` collection instead. Posts are records in your repository, so this call goes to your PDS rather than to the AppView. Which PDS? The program finds out in `Sources/Reads/Resolve.swift`:

```swift
/// Finds the PDS that hosts an account's repository.
///
/// A handle resolves to a DID, and the DID document names the PDS.
func resolvePDS(_ actor: String, appview: Client) async throws -> Client {
  // 1. Handle → DID. A DID is used as it is.
  let did: String
  if actor.hasPrefix("did:") {
    did = actor
  } else {
    did = try await appview.IdentityResolveHandle(handle: .init(rawValue: actor)).did.rawValue
  }

  // 2. DID → DID document, from the PLC directory or, for did:web, from the domain itself.
  let documentURL: URL
  if did.hasPrefix("did:web:") {
    documentURL = URL(string: "https://\(did.dropFirst("did:web:".count))/.well-known/did.json")!
  } else {
    documentURL = URL(string: "https://plc.directory/\(did)")!
  }
  let (data, _) = try await URLSession.shared.data(from: documentURL)
  let document = try JSONDecoder().decode(DIDDocument.self, from: data)

  // 3. DID document → PDS.
  guard let pds = document.service?.first(where: { $0.id.hasSuffix("#atproto_pds") }) else {
    throw URLError(.cannotFindHost)
  }
  return Client(pds.serviceEndpoint)
}
```

The handle resolves to a DID, the DID's document names the PDS, and the PDS serves the repository. Any PDS works, not only the one Bluesky runs.

Feel free to copy these post URIs into a browser interface to get a better look at them. Anything interesting here?
