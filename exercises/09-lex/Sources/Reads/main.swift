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
