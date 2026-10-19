# Building an Agent

For our first exercise for this Workshop portion, we're going to build the bot from the [build an agent](https://atproto.com/guides/bot-tutorial) tutorial from our docs, in Swift. Follow the [Swift version of the tutorial](https://nnabeyang.github.io/bsky-bot-swift/).

*You will likely want to register a new account for this tutorial so you don't spam your existing followers. The starter already has the Swift code generated from the Lexicons the bot uses, so there's no step for installing Lexicons — we'll explain how that works later.*

The `bot` in this directory is [bsky-bot-swift](https://github.com/nnabeyang/bsky-bot-swift), which can already log in with an app password. If `bot` is empty, fetch it first, then go into it:

```bash
cd /workspace/exercises/08-agent
git submodule update --init bot
cd bot
```

Then, proceed from the first chapter of the tutorial, starting with filling in `.env`.

In this exercise, you'll deploy a standalone bot that can create records on the network, and add functionality for it to get existing records and reply to them. Feel free to deviate from the tutorial in its second chapter — once you have the bot working and posting, you can have it interact with other users in any way you can think of! The `complete` branch of bsky-bot-swift has the finished bot, if you want to compare.

Just remember our rules: If your bot interacts with other users, please only interact (like, repost, reply, etc.) if the user has tagged the bot account. It should be an opt-in interaction.
