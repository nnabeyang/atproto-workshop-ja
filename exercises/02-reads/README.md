# データの読み込み

さて、それではHTTP APIを使って、いくつか個別にデータを読み取ってみましょう！JetstreamのWebSocketを除けば、ATレコードを扱う操作のほとんどは単なるHTTP呼び出しです。ここでは、実際に動作する例を見ていきます。

認証なしでAPIとやり取りするための簡単な Swift プログラムを`Sources/Reads/main.swift`に用意しました。内容は以下のとおりです:

```swift
import Foundation
import SwiftAtproto

let appviewClient = Client("https://public.api.bsky.app")

let args = CommandLine.arguments.dropFirst()

let defaultActor = "jp.bsky.app"
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

`ActorGetProfile` などの呼び出しているメソッドは、[swift-atproto](https://github.com/nnabeyang/swift-atproto) がレキシコンから生成した Swift のコードで、`Sources/Reads/Lexicon` にあります。このようなコードは、後の演習で自分で生成します。

このプログラムを実行するには、このディレクトリで `swift run` を使ってビルドし、実行します:

```bash
cd /workspace/exercises/02-reads
swift run reads
```

初回の実行では、依存パッケージのダウンロードとビルドを行うため、少し時間がかかります。特に引数を指定せずに実行すれば、次のBlueskyプロフィールが表示されます:

```
{
  "associated" : {
    "activitySubscription" : {
      "allowSubscriptions" : "followers"
    },
    "chat" : {
      "allowGroupInvites" : "none",
      "allowIncoming" : "all"
    },
    "feedgens" : 0,
    "labeler" : false,
    "lists" : 4,
    "starterPacks" : 4
  },
  "avatar" : "https://cdn.bsky.app/img/avatar/plain/did:plc:ry3hbexak5ytsum7aazhpkbv/bafkreienc27b7pfsjflwvh645zh7ywb3ruwgshwqziv3ilo5mqsksjnl3i",
  "banner" : "https://cdn.bsky.app/img/banner/plain/did:plc:ry3hbexak5ytsum7aazhpkbv/bafkreid2u5md56vpo5xabs6tu3bbscf3zgfzbwxhkh3wedrh46lpvnzloe",
  "createdAt" : "2026-03-31T23:39:06.356Z",
  "description" : "Bluesky日本語公式アカウントです（ユーザー名をチェック👆）。\n\n✉️ バグのご報告、機能リクエスト、フィードバックはこちらのメールアドレスへ →  support@bsky.app\n⚠️ 違反行為などの報告は、投稿右下の「…」→「投稿を報告」からお願いします。",
  "did" : "did:plc:ry3hbexak5ytsum7aazhpkbv",
  "displayName" : "Bluesky日本語（公式）",
  "followersCount" : 30399,
  "followsCount" : 7,
  "handle" : "jp.bsky.app",
  "indexedAt" : "2026-10-09T00:57:41.057Z",
  "labels" : [

  ],
  "pinnedPost" : {
    "cid" : "bafyreiaupiqpvecwabwcyuql3ixp5q5f5us4zy5fdjmjsb7p7w2zgekip4",
    "uri" : "at://did:plc:ry3hbexak5ytsum7aazhpkbv/app.bsky.feed.post/3mikfzwbw2k2j"
  },
  "postsCount" : 186,
  "verification" : {
    "trustedVerifierStatus" : "none",
    "verifications" : [
      {
        "createdAt" : "2026-04-03T00:02:41.492Z",
        "isValid" : true,
        "issuer" : "did:plc:z72i7hdynmk6r22z27h6tvur",
        "issuerDisplayName" : "Bluesky",
        "issuerHandle" : "bsky.app",
        "uri" : "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.graph.verification/3mikg6mqywn2r"
      }
    ],
    "verifiedStatus" : "valid"
  }
}
```

## データを読み取るその他の方法

他にもいくつか実行方法があります。例えば、`alice.example.com` の代わりに、追加の引数として自分の **ハンドル** を指定してみてください:

```bash
swift run reads alice.example.com
```

これであなたのプロフィールが返されるはずです。これらのケースでは、Bluesky の AppView の `app.bsky.actor.getProfile` を呼び出しています。また、引数に`posts`を追加することで、同じプログラムを使って最新の投稿10件を取得することもできます：

```bash
swift run reads alice.example.com posts
```

この場合、代わりに`app.bsky.feed.post`コレクションに対して`com.atproto.repo.listRecords`が呼び出されます。投稿はあなたのリポジトリにあるレコードなので、この呼び出しは AppView ではなく、あなたの PDS に送られます。では、どの PDS でしょうか？ プログラムは `Sources/Reads/Resolve.swift` でそれを調べています:

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

ハンドルから DID が分かり、DID ドキュメントに PDS が書かれていて、その PDS がリポジトリを提供しています。Bluesky が運営する PDS に限らず、どの PDS でも同じように動きます。

取得した投稿のURIをブラウザにコピーして、中身を詳しく確認してみてください。何か面白い発見はありましたか？
