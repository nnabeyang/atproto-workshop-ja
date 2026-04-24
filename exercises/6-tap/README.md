# バックフィル

バックリンクの利用とは対照的に、今回はレコードの **バックフィル（Backfill）** を行います。これはより大掛かりな解決策であり、ネットワーク上の AT レコードを実際にローカルデータベースへと複製し、それらを自ら提供できるようにする手法です。

これは atproto の中核となる原則の一つです。研究目的であれ何であれ、誰でもネットワークの完全なコピーをバックフィルすることが認められています。ただし、現状の全データ量は 2桁テラバイトに達しており、今回の演習で扱うには現実的ではありません。

そこで今回は、特定の条件に一致する、比較的少数のレコードのみをバックフィルします。

まず、[レコードのバックフィル](https://atproto.com/guides/backfilling)をするためのツールである `tap` を実行しましょう。 `tap` はこのワークスペースにインストール済みですので、1つ目のターミナルで `tap run` を実行してください:

```bash
tap run --disable-acks=true
```

次に、別のターミナルでフィードジェネレーターのサンプルを実行します。フィードジェネレーターはバックフィルの代表的なユースケースです。ネットワークを監視してレコードを取り込み、独自のアルゴリズムに従って、配信したいレコードをエンドポイントから再配信する必要があるからです。

このスクリプトを実行するために、まずはこのディレクトリで依存パッケージをインストールしましょう:

```bash
cd /workspace/exercises/6-tap
npm i
```

インストールが終わったら、次のコマンドでスクリプトを実行します:

```bash
npx tsx src/index.ts 
```

フィードジェネレーターの起動ログが表示された後、いくつかの投稿がターミナルに流れてくるはずです。

```
Indexer connected to Tap server

Feed Generator Running

Server: http://localhost:3000
Feed: whats-alf
Terms: alf
Tap: http://localhost:2480
Repos: 1

To test (generate a JWT with goat):
goat account service-auth --aud did:example:alice

Then:
curl -H "Authorization: Bearer " "http://localhost:3000/xrpc/app.bsky.feed.getFeedSkeleton?feed=at%3A%2F%2Fdid%3Aexample%3Aalice%2Fapp.bsky.feed.generator%2Fwhats-alf"

Listening for posts matching: alf

Added 1 repo(s) to follow

CREATE at://did:plc:ragtjsm2j2vknwkz3zp4oxrd/app.bsky.feed.post/3jux6xlrdb42v
  "Run?? Alf was the date I struck out with ☹️"
  ⭐ Added to index (1 total)
CREATE at://did:plc:ragtjsm2j2vknwkz3zp4oxrd/app.bsky.feed.post/3jux7x2uvip2v
  "god is that okay? I'm really confused right now, Alf broke m..."
  ⭐ Added to index (2 total)
```

異なる検索ワードを指定したり、特定のユーザーの投稿からフィードを生成したりしたい場合は、次のように環境変数や引数を変更して実行できます:

```bash
FEED_SEARCH_TERMS="Zangief" npx tsx src/index.ts "did:plc:vmt7o7y6titkqzzxav247zrn"
```

限られた時間内では、フィードジェネレーターのアーキテクチャ全体を詳しく解説することはできませんが、詳細なチュートリアルを https://atproto.com/guides/custom-feed-tutorial で確認いただけます。さて、tap を使った他のユースケースとして、どのようなものが思い浮かびますか？
