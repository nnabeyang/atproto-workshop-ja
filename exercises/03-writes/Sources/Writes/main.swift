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
