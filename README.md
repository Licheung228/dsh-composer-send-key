# Composer send key

Switch the DeepSeek Harness message box send shortcut between two modes:

| Mode | Enter | Shift+Enter |
|---|---|---|
| Default | Send | New line |
| Edit-friendly | New line | Send |

## Install

In DeepSeek Harness, open **Plugins → Add plugin** and install
`dsh-composer-send-key`. You can also install it from the command line:

```sh
dsh plugin --profile <profile> add dsh-composer-send-key
```

## Usage

Open **Settings → General → Send shortcut** and pick a mode. The change
applies immediately (no restart) and persists in your profile's settings
document through the volatile `mode` field of the `composer-send-key` entry.

You can also set it directly in the profile patch:

```yaml
- id: composer-send-key
  name: 'dsh-composer-send-key'
  config:
    mode: edit-friendly # or: default
```

## Behavior notes

- Ctrl/⌘+Enter keeps the built-in accelerated delivery; other modifiers are
  never rewritten.
- The busy-state Composer Enter preference (queue/steer) keeps working in
  both modes.
- In edit-friendly mode the two keys swap completely: with the suggestion
  menu open, Enter inserts a newline and Shift+Enter confirms the highlighted
  item (exactly the other gesture's stock behavior).
- IME composition is left untouched: a composition-closing Enter never
  submits or inserts a stray newline.
- The Send button, the shortcuts reference page and its fixed Enter bindings
  keep their shipped appearance and wording.
- Disabling or removing the plugin restores the default behavior.

## How it works

The shipped composer hardcodes Enter/Shift+Enter in its Lexical keymap and
exposes no extension point for it. In edit-friendly mode this plugin swaps
the `shiftKey` modifier of the original keydown event in the capture phase,
before the composer's own handler runs, so every shipped guard (busy state,
command-menu arbitration, IME window, held-key repeat) is preserved. In
default mode the listener does nothing.

Because this relies on the composer's internal DOM (`[data-composer-card]`)
and keyboard handling, re-verify the plugin after a DeepSeek Harness
upgrade; if the internals change, the plugin falls back to the stock
behavior rather than breaking the input.
