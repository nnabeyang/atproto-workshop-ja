# データの書き込み

演習2と似た内容ですが、今回は実際にログインして投稿を行います。具体的には、ネットワーク上に新しいレコードを作成します。

`Sources/Writes/main.swift`に、短いプログラムを用意しました:

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

`Client` や `resolvePDS` による PDS の検索、API 呼び出しなど、一部は前回の演習で見覚えがあるはずです。今回はそこに `com.atproto.server.createSession` によるログインの手順を追加し、返ってきたアクセストークンを付けて呼び出すことで、`com.atproto.repo.createRecord` を実行して実際に新しいレコードを書き込めるようになります。

注目すべき点は、これが既存レコードの読み取りとそれほど大きく変わらないということです。HTTP の GET と POST の違いのようなものだと考えてください。読み込みも書き込みも、本質的には似たような API 呼び出しです。

ログインには、アカウント自体のパスワードではなく、アプリパスワードを使ってください。アプリパスワードは、Blueskyアプリの「設定 > プライバシーとセキュリティ > アプリパスワード」から作成できます。

このプログラムを実行するには、このディレクトリで、ハンドルとアプリパスワードを指定して `swift run` を実行します:

```bash
cd /workspace/exercises/03-writes
swift run writes your-handle your-app-password
```

ご安心ください。デフォルトでは、新しい Bluesky の投稿を作成するわけではありません。代わりに、 `app.bsky.feed.post` ではなく、別のレキシコン  `xyz.statusphere.status` を使用します。これは **デモ用の例題（toy examples）** で使われるもので、実際のアプリにデータが表示されることはありません。

実行すると、次のような結果が得られるはずです：

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

これまでと同様に、ATレコードの閲覧に対応したブラウザで at:// URI を開けば、PDS側にどのように保存されているかを確認できます： https://pdsls.dev/at://did:plc:l3djuf7oyovspyoyxpziojbp/xyz.statusphere.status/3mybawhaq2k2t

このような内容のレコードが作成されました： 🍕

もし、このアプリを使ってBlueskyに投稿をしてみたいなら、引数をいくつか追加して実行するだけです！

```bash
swift run writes your-handle your-app-password bsky "wow I love this great workshop by @alex.bsky.team"
```

注：フォロワーへのスパム行為について、私は一切の責任を負いませんのであしからず。
