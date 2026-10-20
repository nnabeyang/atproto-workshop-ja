# レキシコン

前回のワークショップに参加された方は、認証なしでネットワークからデータを読み取る演習を行ったことを覚えているかもしれません。

先ほどそのプロジェクトをセットアップした際、あえて一つの手順をスキップしました。それが「レキシコンのインストールと、そこからのコード生成」です。

このディレクトリには、演習2と同じプログラムがあります。`Sources/Reads/main.swift` のコードは以下のようになっています:

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

ただし今回は、`Sources/Reads/Lexicon` が空です。ビルドしようとすると、次のようなエラーが出ます:

```bash
cd /workspace/exercises/09-lex
swift build
```

```
Sources/Reads/Client.swift:9:16: error: cannot find type 'XRPCCallable' in scope
Sources/Reads/Resolve.swift:17:29: error: value of type 'Client' has no member 'IdentityResolveHandle'
```

`XRPCCallable` や、`ActorGetProfile`、`IdentityResolveHandle` といったメソッドは手で書いたものではなく、レキシコンから生成されるものです。

TypeScript SDKに付属する `lex` CLI を使うと、Atmosphere上のどこに公開されているレキシコンでも、それを解決・インストールしてプロジェクト内で呼び出せるようになります。インストールは使う言語に依存しないので、Swift からも使えます。このコードでは、`app.bsky.actor.getProfile`、`app.bsky.feed.post`、`com.atproto.repo.listRecords`、`com.atproto.identity.resolveHandle` を使用しています。つまり、以下のコマンドを実行すればよいのです:

```bash
lex install app.bsky.actor.getProfile app.bsky.feed.post com.atproto.repo.listRecords com.atproto.identity.resolveHandle
```

これは NSID から各レキシコンを探し、それらが参照するすべてのレキシコンとあわせて、JSON ファイルとして `lexicons/` に保存します。インストールした内容は `lexicons.json` にも記録されます。

次に、[swift-atproto](https://github.com/nnabeyang/swift-atproto) を使って、これらのファイルから Swift のコードを生成します。設定は `.atproto.json` にあり、`lexicons/` にあるすべてのレキシコンを読み込んで、コードを `Sources/Reads/Lexicon` に書き出します:

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

パッケージプラグインを実行します:

```bash
swift package --disable-experimental-prebuilts plugin \
  --allow-writing-to-package-directory \
  --allow-network-connections all:443 \
  swift-atproto
```

これでエラーが解消され、プログラムは前と同じように実行できます:

```bash
swift run reads
```

なぜこの手順が必要なのでしょうか？それは、この仕組みによって **あらゆる** レキシコンをファーストクラスとしてサポートできるからです。そこには、あなたが今作ったばかりの独自のレキシコンと、公式のレキシコンとの間に一切の区別はありません。
