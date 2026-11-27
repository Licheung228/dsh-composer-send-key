import { CTRL_COMBO, EDIT_FRIENDLY_MODE } from './constants.js'
import type { KeyFacts, KeyRewrite, Mode, SendCombo } from './types.js'

/**
 * Decide which modifier the composer's keymap must see for this Enter.
 *
 * Default mode never rewrites. Edit-friendly keeps every other modifier
 * combination untouched: accelerated delivery (Meta/Alt) and IME-closing
 * Enter must keep their shipped meaning.
 */
export function resolveEnterRewrite(
  facts: KeyFacts,
  mode: Mode,
  combo: SendCombo,
): KeyRewrite | null {
  if (mode !== EDIT_FRIENDLY_MODE) return null
  if (facts.key !== 'Enter' || facts.composing || facts.altGraph) return null
  if (facts.metaKey || facts.altKey) return null

  if (combo === CTRL_COMBO) {
    // Ctrl+Shift+Enter is reserved by the shipped keymap.
    if (facts.ctrlKey && facts.shiftKey) return null
    if (facts.ctrlKey) return { ctrlKey: false }
    if (facts.shiftKey) return null
    return { shiftKey: true }
  }

  // Shift+Enter sends: Ctrl/⌘+Enter keeps accelerated delivery.
  if (facts.ctrlKey) return null
  return { shiftKey: !facts.shiftKey }
}
