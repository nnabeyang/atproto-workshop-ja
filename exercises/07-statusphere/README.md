# Statusphere（ステータスフィア）

さあ、ワークショップもいよいよ終盤です。これが最後の演習です。

演習3で "xyz.statusphere.status" というレコードを作成したのを覚えていますか？ 実は、それらは "Statusphere" というサンプルアプリの実装手順を記した[チュートリアル](https://atproto.com/guides/statusphere-tutorial)から来ているものです。

Statusphere は Atmosphere 上でレコードの作成と読み込みを行います。独自のレコードを書き込むこともできますし、同じレキシコンを用いて公開されている他のユーザーのレコードを表示することも可能です。

このディレクトリにある `sample-app` は、Statusphere の SwiftUI 版である [statusphere-swift](https://github.com/nnabeyang/statusphere-swift) で、開発の出発点となるコードです。atproto OAuth でログインできる iOS アプリの基本的な構成は整っていますが、それ以外の機能はまだ実装されていません。ここから作業を開始して、[Swift 版のチュートリアル](https://nnabeyang.github.io/statusphere-swift/)を完成させてみましょう。進めながら自由にコードを書き換えてみてください。時間内に完成できなくても大丈夫です！ この演習の目的は、特定のレコードを題材に、これまでの要素を「すべて統合する」とどのような形になるのかを体感してもらうことにあります。

この演習では iOS アプリを作るため、Codespaces では動きません。Xcode 27 と iOS シミュレーターが入った Mac が必要です。Mac 上で、サブモジュールを含めてこのリポジトリをクローンし、プロジェクトを開いてください:

```bash
git clone --recurse-submodules -b swiftlang-ja https://github.com/nnabeyang/atproto-workshop-ja.git
cd atproto-workshop-ja/exercises/07-statusphere/sample-app
open Statusphere.xcodeproj
```

`--recurse-submodules` を付けずにクローンした場合は、`git submodule update --init` を実行して `sample-app` を取得してください。完成版のアプリは statusphere-swift の `complete` ブランチにあるので、比べてみたいときに参照してください。
