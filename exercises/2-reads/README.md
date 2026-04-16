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
  did: 'did:plc:vmt7o7y6titkqzzxav247zrn',
  handle: 'alex.bsky.team',
  displayName: 'Alex',
  avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:vmt7o7y6titkqzzxav247zrn/bafkreiaho53ylxsdwhsgc7zyh7t6l3q37xwkrdpzbbzx5zrlywztgspn4a@jpeg',
  associated: {
    lists: 0,
    feedgens: 0,
    starterPacks: 0,
    labeler: false,
    chat: { allowIncoming: 'following' },
    activitySubscription: { allowSubscriptions: 'followers' },
    germ: {
      showButtonTo: 'usersIFollow',
      messageMeUrl: 'https://landing.ger.mx/newUser'
    }
  },
  labels: [],
  createdAt: '2023-05-15T15:20:45.790Z',
  verification: {
    verifications: [ [Object] ],
    verifiedStatus: 'valid',
    trustedVerifierStatus: 'none'
  },
  description: 'the passive pasadena thrill | bsky devrel\n' +
    '\n' +
    'book a meeting: https://calendar.app.google/rNeqWSx2uMfzhQYV6',
  indexedAt: '2026-02-20T21:02:25.750Z',
  banner: 'https://cdn.bsky.app/img/banner/plain/did:plc:vmt7o7y6titkqzzxav247zrn/bafkreigvwsqd5vpvo7qg3prrbeudyg2jcnoburwsca3ahmelzehiumxzrm@jpeg',
  followersCount: 1256,
  followsCount: 699,
  postsCount: 1730,
  pinnedPost: {
    cid: 'bafyreideit7u37hyuhtgapiypl4wpgcenxif7l3bypplwkvjoknz4pujdq',
    uri: 'at://did:plc:vmt7o7y6titkqzzxav247zrn/app.bsky.feed.post/3lripmoyr3c2y'
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
