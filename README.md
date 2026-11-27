# Composer send key

[English](README.md) | [中文](README.zh.md)

Choose how the DeepSeek Harness message composer sends.

| Mode | Enter | Send with |
|---|---|---|
| Default | Sends | `Enter` |
| Edit-friendly | Inserts a new line | `Shift + Enter` or `Ctrl + Enter` |

## Install

1. Open **Plugins** in DeepSeek Harness.
2. Choose **Add plugin**.
3. Enter `dsh-composer-send-key` and confirm.

The package installs from npm, so no local path is needed. From a terminal:

```sh
dsh plugin --profile <profile> add dsh-composer-send-key
```

## Usage

Open **Settings → Send shortcut**. The page has two choices:

- **Default** — `Enter` sends and `Shift + Enter` starts a new line.
- **Edit-friendly** — `Enter` starts a new line. The shortcut row underneath chooses whether `Shift + Enter` or `Ctrl + Enter` sends.

The change applies immediately and is stored in your profile. You can also set it in the profile patch:

```yaml
- id: composer-send-key
  name: 'dsh-composer-send-key'
  config:
    mode: edit-friendly # or: default
    combo: shift # or: ctrl
```

## Behavior

- Scope is the message composer only. The sidebar terminal, search fields and other inputs keep their own `Enter` behavior.
- **Default** leaves the shipped keyboard handling untouched.
- **Edit-friendly with `Shift + Enter`** swaps the two gestures completely, including while the command or suggestion menu is open.
- **Edit-friendly with `Ctrl + Enter`**: `Enter` and `Shift + Enter` insert new lines, `Ctrl + Enter` sends, and `⌘/Alt + Enter` keep their shipped behavior.
- IME composition is untouched: a composition-closing `Enter` never submits or inserts a stray newline.
- The busy-composer queue/steer preference, the Send button and the shortcuts reference keep their shipped behavior.
- Disabling or removing the plugin restores the default behavior.

## Development

The project is TypeScript. Host and Client sources live in `src/` and build to `lib/`:

```sh
pnpm install
pnpm build      # typecheck, then bundle lib/index.js and lib/client.js
pnpm typecheck
```

`src/index.ts` is the Host half (the two volatile preferences). `src/client/` holds the Settings page, the dictionaries and the composer-only key guard. The Client bundle is a single self-contained file that registers through the page's module loader.

This plugin relies on the composer's internal DOM (`[data-composer-card]`) and keyboard handling. Re-check it after a DeepSeek Harness upgrade; if the internals change, the plugin falls back to the shipped behavior instead of breaking input.
