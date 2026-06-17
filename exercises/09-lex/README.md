# レキシコン

前回のワークショップに参加された方は、認証なしでネットワークからデータを読み取る演習を行ったことを覚えているかもしれません。

先ほどそのプロジェクトをセットアップした際、あえて一つの手順をスキップしました。それが「レキシコンのインストールとビルド」です。

ソースファイルのコードは以下のようになっています:

```ts
import { Client } from '@atproto/lex'
import type { AtIdentifierString } from '@atproto/syntax'
import * as app from './lexicons/app.js'

const appviewClient = new Client('https://public.api.bsky.app')
const pdsClient = new Client('https://bsky.social')

const args = process.argv.slice(2)
const actor = (args[0] ?? 'alex.bsky.team') as AtIdentifierString
const command = args[1] ?? 'profile'

async function main() {
    if (command === 'posts') {
        const posts = await pdsClient.list(app.bsky.feed.post, { limit: 10, repo: actor })
        console.log(posts);
    } else {
        const profile = await appviewClient.call(app.bsky.actor.getProfile, { actor })
        console.log(profile);
    }
}

main()
```

`npm i` で依存関係をインストールした後でも、まだ1箇所、インポートエラーが出ている行があることに気づくでしょう。この行です： `import * as app from './lexicons/app.js'`

TypeScript SDKである `lex` の仕組みは、Atmosphere上のどこに公開されているレキシコンでも、それを解決・インストールし、ビルドしてプロジェクト内で呼び出せるようにするものです。このコードでは、`app.bsky.feed.post` と `app.bsky.actor.getProfile` を使用しています。つまり、以下のコマンドを実行すればよいのです:

```bash
lex install app.bsky.feed.post app.bsky.actor.getProfile
lex build
```

これでインポートエラーが解消され、スクリプトは実行可能になります:

```bash
npx tsx src/index.ts
```

なぜこの手順が必要なのでしょうか？それは、この仕組みによって **あらゆる** レキシコンをファーストクラスとしてサポートできるからです。そこには、あなたが今作ったばかりの独自のレキシコンと、公式のレキシコンとの間に一切の区別はありません。
