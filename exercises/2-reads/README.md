# データの読み込み

さて、それではHTTP APIを使って、いくつか個別にデータを読み取ってみましょう！JetstreamのWebSocketを除けば、ATレコードを扱う操作のほとんどは単なるHTTP呼び出しです。ここでは、実際に動作する例を見ていきます。

認証なしでAPIとやり取りするための簡単なスクリプトを`src/index.ts`に用意しました。内容は以下のとおりです:

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

このスクリプトを実行するために、まずはこのディレクトリで依存パッケージをインストールしましょう:

```bash
cd /workspace/exercises/2-reads
npm i
```

インストールが終わったら、次のコマンドでスクリプトを実行します。

```bash
npx tsx src/index.ts
```

特に引数を指定せずに実行すれば、次のBlueskyプロフィールが表示されます:

```
{
  did: 'did:plc:ry3hbexak5ytsum7aazhpkbv',
  handle: 'jp.bsky.app',
  displayName: 'Bluesky日本語（公式）',
  avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:ry3hbexak5ytsum7aazhpkbv/bafkreienc27b7pfsjflwvh645zh7ywb3ruwgshwqziv3ilo5mqsksjnl3i',
  associated: {
    lists: 1,
    feedgens: 0,
    starterPacks: 1,
    labeler: false,
    activitySubscription: { allowSubscriptions: 'followers' }
  },
  labels: [],
  createdAt: '2026-03-31T23:39:06.356Z',
  verification: {
    verifications: [
      {
        issuer: 'did:plc:z72i7hdynmk6r22z27h6tvur',
        uri: 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.graph.verification/3mikg6mqywn2r',
        isValid: true,
        createdAt: '2026-04-03T00:02:41.492Z'
      }
    ],
    verifiedStatus: 'valid',
    trustedVerifierStatus: 'none'
  },
  description: 'Bluesky日本語公式アカウントです（ユーザー名をチェック👆）。\n' +
    '\n' +
    'バグのご報告、機能リクエスト、フィードバックはこちらへ →  support@bsky.app',
  indexedAt: '2026-04-03T00:35:19.149Z',
  banner: 'https://cdn.bsky.app/img/banner/plain/did:plc:ry3hbexak5ytsum7aazhpkbv/bafkreid2u5md56vpo5xabs6tu3bbscf3zgfzbwxhkh3wedrh46lpvnzloe',
  followersCount: 22097,
  followsCount: 6,
  postsCount: 56,
  pinnedPost: {
    cid: 'bafyreiaupiqpvecwabwcyuql3ixp5q5f5us4zy5fdjmjsb7p7w2zgekip4',
    uri: 'at://did:plc:ry3hbexak5ytsum7aazhpkbv/app.bsky.feed.post/3mikfzwbw2k2j'
  }
}
```

## Other ways to read data

## データを読み取るその他の方法

他にもいくつか実行方法があります。例えば、追加の引数として自分の **ハンドル** を指定してみてください:

```bash
npx tsx src/index.ts you.bsky.social
```

これであなたのプロフィールが返されるはずです。これらのケースでは、内部的に`client.call(app.bsky.actor.getProfile)`を実行しています。また、引数に`posts`を追加することで、同じスクリプトを使って最新の投稿10件を取得することもできます：

```bash
npx tsx src/index.ts you.bsky.social posts
```

この場合、代わりに`client.list(app.bsky.feed.post)`が呼び出されます。取得した投稿のURIをブラウザにコピーして、中身を詳しく確認してみてください。何か面白い発見はありましたか？
