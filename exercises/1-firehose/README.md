# Firehoseからデータを取得する

まずはプロトコルの生データを確認することから始めましょう。

本演習では、**ファイアホース（Firehose）** エンドポイントではなく、**ジェットストリーム（Jetstream）** エンドポイントを使用します。これらは非常に似ており、どちらもリレーから配信（ブロードキャスト）され、ネットワーク上のすべてのレコードを含んでいます。

両者の違いとして、ファイアホースには今回の演習のようなコマンドライン操作では扱いにくいデータが含まれていますが、ジェットストリームはすべて JSON 形式で提供されています。詳細については、https://atproto.com/guides/streaming-data のガイドを参照してください。

`websocat`は WebSocket からデータをストリーミングするための CLI ツールです。これを使って、ジェットストリームのエンドポイントに接続してみましょう:

```bash
websocat wss://jetstream1.us-east.bsky.network/subscribe
```

かなりのデータ量ですね！Ctrl+C を押すと、ターミナルで実行中のプロセスを停止できます。次は、出力を `jq` と `less` にパイプで渡して、中身を確認しやすくしてみましょう:

```bash
websocat wss://jetstream1.us-east.bsky.network/subscribe | jq . --unbuffered | less
```

さて、これでプロトコルの雰囲気が掴めてきたかと思います。続いて、以下の追加コマンドを実行して出力からURLを抽出し、ブラウザで実際に表示してみましょう:

```bash
websocat wss://jetstream1.us-east.bsky.network/subscribe \
  | jq -r --unbuffered 'select(.kind == "commit" and .commit.collection == "app.bsky.feed.post") | .did + "/" + .commit.collection + "/" + .commit.rkey' \
  | head -n 1 \
  | xargs -I {} open "https://pdsls.dev/at://{}"
```

さあ、いよいよ面白くなってきました。ここでは、完全な at:// URI 構造と、AT レコードに含まれる内容を確認できます。今回の例では、ブラウザで開くために意図的に `app.bsky.feed.post` レコードを抽出しましたが、このプロトコルには他にも多くの **レキシコン（Lexicon）** が存在します。ネットワーク上のレコードの大部分は、実際には Bluesky の「いいね（likes）」ですが、他のアプリによって公開されたレキシコンもたくさんあります！

ブラウザまたはコマンドラインで少し探索してみて、それらの感触を確かめてみてください。何か面白いことに気づきましたか？
