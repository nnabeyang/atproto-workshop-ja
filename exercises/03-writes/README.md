# Writing data

This is going to be similar to Exercise 2, but this time, you'll actually log in and post — i.e., create new records on the network.

Here, in `Sources/Writes/main.swift`, we have another little program:

```swift
import Foundation
import SwiftAtproto

let appviewClient = Client("https://public.api.bsky.app")

let args = CommandLine.arguments.dropFirst()
let username = args.first ?? "your-handle.example.com"
let password = args.dropFirst().first ?? "your-app-password"
let command = args.dropFirst(2).first ?? "statusphere"
let contents = args.dropFirst(3).first ?? "🍕"

/// Prints a response as indented JSON.
func printJSON(_ value: some Encodable) throws {
  let encoder = JSONEncoder()
  encoder.outputFormatting = [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes]
  print(String(decoding: try encoder.encode(value), as: UTF8.self))
}

// Log in to the account's own PDS, found the same way as in exercise 2.
var client = try await resolvePDS(username, appview: appviewClient)
let session = try await client.ServerCreateSession(input: .init(identifier: username, password: password))
client.accessJwt = session.accessJwt

let createdAt = FormatString<Date>(Date())

/// Writes a record to the logged-in account's repository.
func create(_ record: some ATProtoRecord) async throws -> Com.Atproto.RepoCreateRecord.ResponseBody {
  try await client.RepoCreateRecord(
    input: .init(
      collection: .init(rawValue: type(of: record).nsId),
      record: .record(record),
      repo: .init(rawValue: session.did.rawValue)
    )
  )
}

if command == "bsky" {
  let post = try await create(App.Bsky.FeedPost.make(createdAt: createdAt, text: contents))
  try printJSON(post)
} else {
  let status = try await create(Xyz.Statusphere.Status.make(createdAt: createdAt, status: contents))
  try printJSON(status)
}
```

Some of this — like the `Client`, finding the PDS with `resolvePDS`, and the API calls — should be recognizable from the last exercise. This time, however, we're adding a login step with `com.atproto.server.createSession`, and sending the access token it returns with our calls, meaning that we're able to call `com.atproto.repo.createRecord` to actually write new records!

One thing to note is that this isn't very different from reading existing records — it's a lot like the difference between an HTTP GET and a POST. Reading and writing are similar API calls.

Log in with an app password rather than your account's own password. You can make one in the Bluesky app under Settings > Privacy and security > App passwords.

To run this program, build and run it with `swift run` from this directory, giving your handle and app password:

```bash
cd /workspace/exercises/03-writes
swift run writes your-handle your-app-password
```

Now, don't worry — by default, this isn't going to create new Bluesky posts. Instead, we're defaulting to a different record Lexicon — `xyz.statusphere.status` instead of `app.bsky.feed.post`. This is used for toy examples, and won't be picked up by any real-world apps.

This should produce a result like:

```
{
  "cid" : "bafyreidfqlj4yrhp4l4vx6kfqctay37qgwnbsrsq522q73cvdzaml6fyr4",
  "commit" : {
    "cid" : "bafyreihgrl2n2zk4fds4sdakmd5wnzlo2zzzi25qqdjjkc4kfdzl4neonu",
    "rev" : "3mybawhauws2t"
  },
  "uri" : "at://did:plc:l3djuf7oyovspyoyxpziojbp/xyz.statusphere.status/3mybawhaq2k2t",
  "validationStatus" : "unknown"
}
```

As usual, we can pop that at:// URI into a browser that supports browsing AT records to see what it looks like on the PDS side: https://pdsls.dev/at://did:plc:l3djuf7oyovspyoyxpziojbp/xyz.statusphere.status/3mybawhaq2k2t.

We created a record with these contents: 🍕

If you wanted to use this app to actually post for real, just add some additional arguments!

```bash
swift run writes your-handle your-app-password bsky "wow I love this great workshop by @alex.bsky.team"
```

Note: I am not responsible for you spamming your followers.
