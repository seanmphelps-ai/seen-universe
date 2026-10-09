# PROVENANCE

Every file in this repo carries a one-line header as its first line:

```
// PROVENANCE: bot=<bot-name> session=<YYYY-MM-DD> task=<what-it-was-asked-to-do>
```

## The gate

`.githooks/pre-commit` blocks any commit where a staged file is missing that header. The commit fails and names the file.

## Install (once per clone)

```
git config core.hooksPath .githooks
```

## Why

Git blame shows your name because bots commit through your authenticated session. The header travels with the file itself, so the culprit is traceable regardless of who pushed.
