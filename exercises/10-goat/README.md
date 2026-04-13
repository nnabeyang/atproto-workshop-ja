# Goat

In exercise 9, we used `lex` to install and build Lexicons that already exist. Now let's create our own.

The good news: you don't have to write JSON from scratch. The `goat` CLI can scaffold Lexicons for you, and its linter will tell you when you've done something wrong.

First, let's pull down some existing Lexicons to see how they're structured:

```bash
goat lex pull app.bsky.feed.post
goat lex pull xyz.statusphere.status
```

Take a look at those files. Notice how they define fields, types, and descriptions.

Now lint them to see what `goat` checks for:

```bash
goat lex lint lexicons/
```

## Create your own Lexicon

Here's where it gets fun. Pick a silly domain to model — something small but with at least 2-3 fields. Some ideas:

- **Houseplant tracker** — species, last watered date, happiness level
- **Sandwich ratings** — ingredients, rating, review
- **Book log** — title, author, status (reading/finished/abandoned)
- **Coffee shop reviews** — name, location, wifi quality, outlet availability

Use `goat` to scaffold your record. Replace `your.domain` with something like `dev.yourname`:

```bash
goat lex new record your.domain.plant
```

This creates a skeleton. Now open it up and add your fields. The [Lexicon Style Guide](https://atproto.com/guides/lexicon-style-guide) has the rules, but the key ones are:

- Use `lowerCamelCase` for field names
- Add `description` to every field
- Don't make fields `required` unless you mean it
- Use objects in arrays (not raw strings/numbers) so you can extend later

You can also experiment with https://prototypey.org/. 

Finally, you could publish your Lexicon to your own repository, so others can install it:

```bash
goat account login
goat lex publish lexicons/your.domain.plant.json
```

Lexicon resolution works by using DNS. You probably don't own `domain.your`, so this won't work out of the box, but if you *did* own that domain and connect it to an atproto account, anyone could `lex install your.domain.plant` and get types for your schema:

```bash
lex install your.domain.plant
lex build
```

You've gone full circle: from consuming Lexicons to publishing them.