# バックリンクの取得

前回の演習では、PDSにレコードがどのように保存されるかを見てきました。では、特定のレコードを参照しているすべてのレコードを見つけたい場合はどうすればよいでしょうか？たとえば、ある投稿に対するすべての「いいね！」や、すべての返信などです。

一つのアプローチは、ネットワーク全体をバックフィル（全データの同期）してローカルデータベースにクエリを実行することです（これは演習6で行います）。しかし、これにはテラバイト規模のデータを保存する必要があり、非常に **大掛かりな** 作業になります。

**バックリンク** は、より軽量な解決策を提供します。バックリンクサービスがネットワークをインデックス化するため、自分ですべてのデータを保存することなく、特定のURIを **指し示している** レコードを照会できるようになります。

## 投稿を表示する

まずは特定の投稿を見てみましょう。ブラウザで次のURLを開いてください:

https://pdsls.dev/at://did:plc:a4pqq234yw7fqbddawjo7y35/app.bsky.feed.post/3m237ilwc372e

これは、あるユーザーの PDS に保存されている投稿レコードです。その構造を確認してみましょう。投稿内容が含まれる `text` フィールドや `createdAt` タイムスタンプのほか、`embed` や `facets` といったフィールドも確認できるはずです。

さて、この投稿にはおそらく「いいね！」や返信がついているはずです。しかし、それらは一体どこにあるのでしょうか？ それらはこのレコードの中には含まれていません。「いいね！」や返信は、他のユーザーの PDS に保存されている独立したレコードであり、それぞれがこの投稿の URI への参照を保持しているのです。

では、どうすればその「いいね!」や返信を見つけられるでしょうか？

## Constellation を使ってみる

[Constellation](https://constellation.microcosm.blue) は、Microcosm が運営しているコミュニティベースのバックリンクサービスです。ネットワークをインデックス化し、レコード間の参照関係を追跡します。

これを使って、先ほどの投稿への「いいね！」をすべて見つけてみましょう。ブラウザで次の URL を開いてください。

https://constellation.microcosm.blue/xrpc/blue.microcosm.links.getBacklinks?subject=at%3A%2F%2Fdid%3Aplc%3Aa4pqq234yw7fqbddawjo7y35%2Fapp.bsky.feed.post%2F3m237ilwc372e&source=app.bsky.feed.like%3Asubject.uri&limit=16

Constellation のウェブインターフェースにより、結果が読みやすい形式で表示されます。元の投稿を指している「いいね！」レコードのリストが表示されるはずです。各エントリには以下の情報が含まれています。
- 「いいね！」レコード自体の AT URI
- 参照が含まれているレコード内のパス (`subject.uri`)

リストからリンクを一つ選び、 `browse record` をクリックして詳細を確認してください。「いいね！」レコードの構造を見ると、 `subject` フィールドに「いいね！」の対象である投稿の URI が含まれていることがわかります。これが Constellation によってインデックス化された「リンク」の正体です。

## コマンドラインからのクエリ実行

Constellation はコマンドラインからもクエリを実行できます。URL を分解して、どのようなリクエストを送っているのかを確認してみましょう:

```bash
curl -s -H "Accept: application/json" \
  "https://constellation.microcosm.blue/xrpc/blue.microcosm.links.getBacklinks?\
subject=at%3A%2F%2Fdid%3Aplc%3Aa4pqq234yw7fqbddawjo7y35%2Fapp.bsky.feed.post%2F3m237ilwc372e&\
source=app.bsky.feed.like%3Asubject.uri&\
limit=16" \
  | jq .
```

主なパラメータは以下のとおりです:
- `subject`: バックリンクの取得先となる AT URI（URL エンコードされており、`%3A` や `%2F` はそれぞれ `:` や `/` に対応します）。
- `source`: 検索対象とするレコードタイプとフィールドパス。ここでは app.bsky.feed.like:subject.uri を指定しています。
- `limit`: 返される結果の最大件数

返却される JSON レスポンスには、条件に一致するレコードを格納した `records` 配列が含まれます。

## 返信を取得する

投稿を参照するレコードは「いいね！」だけではありません。次は、代わりに「返信」を取得してみましょう。違いは source パラメータの指定にあります。「いいね！」を探す代わりに、reply フィールドが対象（ターゲット）を指している投稿を探します:

```bash
curl -s -H "Accept: application/json" \
  "https://constellation.microcosm.blue/xrpc/blue.microcosm.links.getBacklinks?\
subject=at%3A%2F%2Fdid%3Aplc%3Aa4pqq234yw7fqbddawjo7y35%2Fapp.bsky.feed.post%2F3m237ilwc372e&\
source=app.bsky.feed.post%3Areply.parent.uri&\
limit=16" \
  | jq .
```

`source` パラメータを比較してみましょう。
- **いいね:** `app.bsky.feed.like:subject.uri`
- **返信:** `app.bsky.feed.post:reply.parent.uri`

これは、 `reply.parent.uri` フィールドが対象の URI と一致する `app.bsky.feed.post` レコードを検索するよう、Constellation に指示しています。つまり、その投稿に対する直接の返信を見つけ出すことになります。

## バックリンクとバックフィルの使い分け

| アプローチ | 長所（メリット） | 短所（デメリット） |
| :--- | :--- | :--- |
| **バックリンク** | 軽量、ストレージ不要、リアルタイム性 | 外部サービスに依存する |
| **バックフィル** | 完全な制御が可能、オフライン動作、カスタムインデックス作成 | ストレージを大量に消費、同期に遅延が発生する |

バックリンクは、誰が「いいね！」、返信、あるいはリポストをしたかといった、単純な検索に最適です。一方で、複雑なクエリが必要な場合や、データの可用性を自ら担保したい場合、あるいはレコードを一括処理する必要がある場合には、バックフィル（次の演習で詳しく解説します）が適しています。

バックリンクを使って、他にどのような関係性がクエリできるか考えてみましょう。フォローやブロック、リストの所属関係、さらには Bluesky 以外のアプリによるカスタムレコードタイプなど、どのようなものが考えられるでしょうか？
