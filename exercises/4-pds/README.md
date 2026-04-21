# PDSレコード

それでは、これらのレコードが実際にどのようにPDSへ書き込まれるのかを見ていきましょう。じつは、あらかじめ私のPDSに、いくつかテスト用のデータを準備しておきました。皆さんがサーバーにSSHでログインしてそれらを確認できるよう、専用のアカウントも用意してあります。

```bash
ssh workshop@justdothings.net
```

サーバーに接続できたら、 `/pds` ディレクトリの中身を確認してみてください。

```bash
cd /pds
ls
```

これはリファレンス実装の [PDS](https://github.com/bluesky-social/pds) によってインストールされたものです。全体を長々と調べることはしませんが、いくつか観察してみましょう。まず、データベースファイル `account.sqlite` を見てみます:

```bash
sqlite3 account.sqlite
```

ここでホストされているユーザーを確認してみましょう:

```sql
select * from actor;
```

```
did:plc:daqeimb4g5kqqjongj4s6b4p|alex.justdothings.net|2025-10-29T18:14:16.268Z|||
did:plc:lfbdlon3iuvgnrizqzvq2kjb|testuser.justdothings.net|2026-01-27T18:06:34.174Z|||
did:plc:j7gkx5yhhnvczdsrgydushhc|test-user-two.justdothings.net|2026-01-27T18:46:52.347Z|||
```

ほら、私のテストユーザーたちです！面白いですよね。

それでは、各ユーザーの実際のレコードを見ていきましょう...
