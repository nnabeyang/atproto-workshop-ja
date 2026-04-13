# Building an Agent

For our first exercise for this Workshop portion, we're going to follow the [build an agent](https://atproto.com/guides/bot-tutorial) tutorial from our docs.

*You will likely want to register a new account for this tutorial so you don't spam your existing followers. Also, you can skip [Part 1](https://atproto.com/guides/bot-tutorial#part-1-lexicons) — we'll explain why later.*

Start by installing packages with `npm` from this directory:

```bash
cd /workspace/exercises/8-agent
npm i
```

Then, proceed from [Part 2](https://atproto.com/guides/bot-tutorial#part-2-create-a-bot) of the tutorial.

In this exercise, you'll deploy a standalone bot that can create records on the network, and add functionality for it to get existing records and reply to them. Feel free to deviate from the existing tutorial in [Part 5](https://atproto.com/guides/bot-tutorial#part-5-from-bot-to-agent) — once you have the bot working and posting, you can have it interact with other users in any way you can think of!

Just remember our rules: If your bot interacts with other users, please only interact (like, repost, reply, etc.) if the user has tagged the bot account. It should be an opt-in interaction.
