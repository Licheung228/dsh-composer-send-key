import { COMPOSER_CARD_SELECTOR, NON_COMPOSER_SELECTOR } from '../constants.js'

/**
 * The message composer's editor and nothing else.
 *
 * The shell owns Enter in terminals, search fields and form controls; the
 * composer card alone marks the editor this plugin may rewrite.
 */
export function isComposerEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (!target.isContentEditable) return false
  if (target.closest(NON_COMPOSER_SELECTOR) !== null) return false
  return target.closest(COMPOSER_CARD_SELECTOR) !== null
}
