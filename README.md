# Code Repository for Atmosphere Workshops
This repo contains exercises used in the "Consuming the Atmosphere" and "Creating the Atmosphere" workshops.

The slides for these workshops are here:
- [Consuming the Atmosphere](https://docs.google.com/presentation/d/1X0YK4-08p2ujrv5WIT1Fsr8v7FBuSe2VgjOFQdLHi2M/edit?usp=sharing)
- [Creating the Atmosphere](https://docs.google.com/presentation/d/1r_cGG0xRnaXrpwUICxbz4-h0bIwBj6jnyHIt0IBzl9Y/edit?usp=sharing)

Each workshop should take about 3 hours to deliver with one 15-minute break in the middle. For *Consuming the Atmosphere*, aim for about 20 minutes of slides at a time, followed by 20 minutes for each exercise block. *Creating the Atmosphere* can have a looser structure — let people work for 30+ minutes at a time before calling the room back together. You can even consolidate some of the later design exercises together, depending on how participation is going.

Consider using a tool like https://www.slido.com/features-live-qa to gather questions during the workshop, in addition to using a TA and allowing people to raise their hands throughout.

## Hands-On Exercises

Directory Name                     | Exercise
:--------------------------------- | :-------------------------------------------------------
`exercises/1-firehose`             | [Exercise 1](exercises/1-firehose/README.md)
`exercises/2-reads`                | [Exercise 2](exercises/2-reads/README.md)
`exercises/3-writes`               | [Exercise 3](exercises/3-writes/README.md)
`exercises/4-pds`                  | [Exercise 4](exercises/4-pds/README.md)
`exercises/5-backlinks`            | [Exercise 5](exercises/5-backlinks/README.md)
`exercises/6-tap`                  | [Exercise 6](exercises/6-tap/README.md)
`exercises/7-statusphere`          | [Exercise 7](exercises/7-statusphere/README.md)
`exercises/8-agent`                | [Exercise 8](exercises/8-agent/README.md)
`exercises/9-lex`                  | [Exercise 9](exercises/9-lex/README.md)
`exercises/10-goat`                | [Exercise 10](exercises/10-goat/README.md)

## Reference
You can refer to the [atproto docs](https://atproto.com) as you work through this course.

## Exercise Environment for this Course
You can launch an exercise environment for this course using GitHub Codespaces.

Alternatively, you can clone this repository down locally to run the exercises on your own. These are the commands that are run to install dependencies into this environment:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" # install homebrew
brew install websocat jq goat node go pnpm
npm i -g @atproto/lex tsx
go install github.com/bluesky-social/indigo/cmd/tap@latest
```

If you opt for local installation, note that the `lex` CLI can collide with tools already installed in participants' `PATH` environments. In this case, they should substitute the `ts-lex` command. If this happens on a consistent basis, we'll consider updating the docs to refer mainly to `ts-lex`.