# Atmosphereワークショップのコードリポジトリ
このリポジトリには、*Consuming the Atmosphere* および *Creating the Atmosphere* ワークショップで使用される演習が含まれています。

これらのワークショップで使用したスライドはこちらです:
- [Consuming the Atmosphere](https://docs.google.com/presentation/d/1X0YK4-08p2ujrv5WIT1Fsr8v7FBuSe2VgjOFQdLHi2M/edit?usp=sharing)
- [Creating the Atmosphere](https://docs.google.com/presentation/d/1r_cGG0xRnaXrpwUICxbz4-h0bIwBj6jnyHIt0IBzl9Y/edit?usp=sharing)

各ワークショップの所要時間は、途中で15分間の休憩を挟み、合計で約3時間を想定しています。 *Consuming the Atmosphere* では、1セクションにつき「20分程度のスライド解説」と「20分の演習時間」を交互に設けることを目安にしてください。 *Creating the Atmosphere* は、より柔軟な構成で構いません。参加者が30分以上作業した後、一度作業をストップしてもらい、次のステップへ誘導するサイクルで進めてください。また、参加者の進捗状況に応じて、後半のデザイン演習をいくつかまとめて実施しても構いません。

ワークショップ中に質問を収集するために、TA（ティーチングアシスタント）を配置したり、参加者が随時挙手できるようにしたりすることに加えて、https://www.slido.com/features-live-qa のようなツールを利用することを検討してください。

## ハンズオン演習

ディレクトリ                         | 演習
:--------------------------------- | :-------------------------------------------------------
`exercises/1-firehose`             | [演習 1](exercises/1-firehose/README.md)
`exercises/2-reads`                | [演習 2](exercises/2-reads/README.md)
`exercises/3-writes`               | [演習 3](exercises/3-writes/README.md)
`exercises/4-pds`                  | [演習 4](exercises/4-pds/README.md)
`exercises/5-backlinks`            | [演習 5](exercises/5-backlinks/README.md)
`exercises/6-tap`                  | [演習 6](exercises/6-tap/README.md)
`exercises/7-statusphere`          | [演習 7](exercises/7-statusphere/README.md)
`exercises/8-agent`                | [演習 8](exercises/8-agent/README.md)
`exercises/9-lex`                  | [演習 9](exercises/9-lex/README.md)
`exercises/10-goat`                | [演習 10](exercises/10-goat/README.md)

## リファレンス
このコースを進めるにあたっては、 [atproto docs](https://atproto.com) をリファレンスとして参照してください。

## このコースの演習環境
GitHub Codespaces を使用すると、このコースの演習環境を構築できます。

あるいは、このリポジトリをローカルにクローンして、自分で演習を実行することもできます。この環境に依存関係をインストールするために実行されるコマンドは次のとおりです:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" # install homebrew
brew install websocat jq goat node go pnpm
npm i -g @atproto/lex tsx
go install github.com/bluesky-social/indigo/cmd/tap@latest
```

ローカル環境へのインストールを選択した場合、`lex` CLIが参加者の環境（`PATH`）に既にインストールされている他のツールと競合する可能性があることに注意してください。競合が発生した場合は、`lex` コマンドを `ts-lex` に読み替えて実行してください。もしこの問題が頻繁に発生するようであれば、将来的にドキュメント内の表記を `ts-lex` メインに更新することを検討します。
