# Code Repository for Atmosphere Workshops
This repo contains exercises used in the "Consuming the Atmosphere" and "Creating the Atmosphere" workshops.

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