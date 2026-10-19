# Statusphere

OK! We're almost at the end of the workshop now — this is our last exercise.

Remember back in Exercise 3, when we wrote some "xyz.statusphere.status" records? Well, those actually come from an [entire tutorial](https://atproto.com/guides/statusphere-tutorial) implementing a sample app that we call "Statusphere."

Statusphere creates and consumes records from the Atmosphere — it can write its own records, and it can display records from other people publishing under that Lexicon too.

The `sample-app` in this directory is [statusphere-swift](https://github.com/nnabeyang/statusphere-swift), a SwiftUI version of Statusphere. It provides a starting point — it has an iOS app that logs in with atproto OAuth, but no other features yet. Go ahead and work from there to complete the [Swift tutorial](https://nnabeyang.github.io/statusphere-swift/). Feel free to make changes as you go, and don't worry if you don't finish! This is meant to show off what "putting it all together" can look like, for one particular kind of record.

This exercise builds an iOS app, so it doesn't run in Codespaces. You'll need a Mac with Xcode 27 and an iOS simulator. On your Mac, clone this repository with its submodules and open the project:

```bash
git clone --recurse-submodules -b swiftlang https://github.com/nnabeyang/atproto-workshop-ja.git
cd atproto-workshop-ja/exercises/07-statusphere/sample-app
open Statusphere.xcodeproj
```

If you already cloned this repository without `--recurse-submodules`, run `git submodule update --init` to fetch `sample-app`. The `complete` branch of statusphere-swift has the finished app, if you want to compare.
