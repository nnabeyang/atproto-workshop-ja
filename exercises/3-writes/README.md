# データの書き込み

演習2と似た内容ですが、今回は実際にログインして投稿を行います。具体的には、ネットワーク上に新しいレコードを作成します。

`src/index.ts`に、短いスクリプトを用意しました:

```ts
import { Client } from '@atproto/lex'
import type { DatetimeString } from '@atproto/syntax'
import { PasswordSession } from '@atproto/lex-password-session'
import * as app from './lexicons/app.js'
import * as xyz from './lexicons/xyz.js'

const args = process.argv.slice(2)
const username = args[0] ?? 'your-handle.bsky.social'
const password = args[1] ?? 'your-app-password'
const command = args[2] ?? 'statusphere'
const contents = args[3] ?? '🍕'

async function main() {
    const result = await PasswordSession.login({
        service: 'https://bsky.social', // or your PDS host
        identifier: username,
        password: password,
    })

    const client = new Client(result)
    const createdAt = (new Date().toISOString() as DatetimeString)

    if (command === 'bsky') {
        const posts = await client.create(app.bsky.feed.post, { text: contents, createdAt: createdAt })
        console.log(posts);
    } else {
        const profile = await client.create(xyz.statusphere.status, { status: contents, createdAt })
        console.log(profile);
    }
}

main()
```

`Client` の使用や API 呼び出しなど、一部は前回の演習で見覚えがあるはずです。今回はそこにログインの手順を追加することで、 `client.create()` コマンドを実行して実際に新しいレコードを書き込めるようになります。

注目すべき点は、これが既存レコードの読み取りとそれほど大きく変わらないということです。HTTP の GET と POST の違いのようなものだと考えてください。読み込みも書き込みも、本質的には似たような API 呼び出しです。

このスクリプトを実行するには、まずこのディレクトリから `npm` を使ってパッケージをインストールしてください:

```bash
cd /workspace/exercises/3-writes
npm i
```

次に、以下のコマンドでスクリプトを実行します:

```bash
npx tsx src/index.ts your-username your-password
```

ご安心ください。デフォルトでは、新しい Bluesky の投稿を作成するわけではありません。代わりに、 `app.bsky.feed.post` ではなく、別のレキシコン  `xyz.statusphere.status` を使用します。これは **デモ用の例題（toy examples）** で使われるもので、実際のアプリにデータが表示されることはありません。

実行すると、次のような結果が得られるはずです：

```
{
  uri: 'at://did:plc:vmt7o7y6titkqzzxav247zrn/xyz.statusphere.status/3mgbdr5jiqf2p',
  cid: 'bafyreidbqmykcc3q2awfuaar7sxjguqfnuq4oyqarbeajwqlnlbqrejtcu',
  commit: {
    cid: 'bafyreigvagsw5vzvvjcfryppiozfun4dk3afuqy6lwgmzzq6jkanacrvbu',
    rev: '3mgbdr5jpl52p'
  },
  validationStatus: 'unknown'
}
```

これまでと同様に、ATレコードの閲覧に対応したブラウザで at:// URI を開けば、PDS側にどのように保存されているかを確認できます： https://pdsls.dev/at://did:plc:vmt7o7y6titkqzzxav247zrn/xyz.statusphere.status/3mgbdr5jiqf2p

このような内容のレコードが作成されました： 🍕

もし、このアプリを使ってBlueskyに投稿をしてみたいなら、引数をいくつか追加して実行するだけです！

```bash
npx tsx src/index.ts your-username your-password bsky "wow I love this great workshop by @alex.bsky.team"`
```

注：フォロワーへのスパム行為について、私は一切の責任を負いませんのであしからず。
