import { CTRL_COMBO, EDIT_FRIENDLY_MODE } from './constants.js'
import type { KeyFacts, KeyRewrite, Mode, SendCombo } from './types.js'

/** Strip the send modifiers and force the composer's native line break. */
const NEWLINE_REWRITE: KeyRewrite = { shiftKey: true, ctrlKey: false, metaKey: false }

/**
 * Decide which modifier the composer's keymap must see for this Enter.
 *
 * Default mode never rewrites. In edit-friendly mode exactly one chord sends;
 * every other Enter chord is normalized to a line break. Alt/AltGraph and
 * composition are left to the composer.
 */
export function resolveEnterRewrite(
  facts: KeyFacts,
  mode: Mode,
  combo: SendCombo,
): KeyRewrite | null {
  if (mode !== EDIT_FRIENDLY_MODE) return null
  if (facts.key !== 'Enter' || facts.composing || facts.altGraph || facts.altKey) return null

  const isSendChord = combo === CTRL_COMBO
    ? facts.ctrlKey && !facts.shiftKey && !facts.metaKey
    : facts.shiftKey && !facts.ctrlKey && !facts.metaKey

  if (isSendChord) return combo === CTRL_COMBO ? { ctrlKey: false } : { shiftKey: false }

  // Only the chosen chord sends. This includes the shipped Ctrl/⌘ accelerated
  // delivery: any other chord inserts a line break instead of submitting.
  if (facts.ctrlKey || facts.metaKey) return { ...NEWLINE_REWRITE }
  if (facts.shiftKey) return null
  return { shiftKey: true }
}
