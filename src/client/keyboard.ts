import { COMPOSITION_GUARD_MS } from '../constants.js'
import { resolveEnterRewrite } from '../keys.js'
import type { KeyFacts, SettingsValue } from '../types.js'
import { isComposerEditable } from './dom.js'

type Modifier = 'shiftKey' | 'ctrlKey' | 'metaKey'

function keyFacts(event: KeyboardEvent, composingRecently: boolean): KeyFacts {
  return {
    key: event.key,
    shiftKey: event.shiftKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    altKey: event.altKey,
    altGraph: typeof event.getModifierState === 'function' && event.getModifierState('AltGraph'),
    composing: event.isComposing || event.keyCode === 229 || composingRecently,
  }
}

function setModifier(
  event: KeyboardEvent,
  modifier: Modifier,
  value: boolean,
  warned: Set<Modifier>,
): void {
  try {
    Object.defineProperty(event, modifier, {
      configurable: true,
      enumerable: true,
      get: () => value,
    })
  } catch {
    if (warned.has(modifier)) return
    warned.add(modifier)
    console.warn(`[composer-send-key] ${modifier} is not configurable; edit-friendly mode is inactive for this event`)
  }
}

/**
 * Capture-phase modifier swap over the composer editor only. The original
 * event continues untouched otherwise, so busy state, menu arbitration,
 * held-key repeat and IME keep the composer's shipped behavior.
 */
export function installComposerKeyGuard(read: () => SettingsValue): () => void {
  let composing = false
  let composingUntil = 0
  const warned = new Set<Modifier>()

  const recentlyComposing = (): boolean => composing || Date.now() < composingUntil

  const onCompositionStart = (event: Event): void => {
    if (isComposerEditable(event.target)) composing = true
  }
  const onCompositionEnd = (): void => {
    if (!composing) return
    composing = false
    composingUntil = Date.now() + COMPOSITION_GUARD_MS
  }
  const onKeyDown = (event: KeyboardEvent): void => {
    if (!isComposerEditable(event.target)) return
    const settings = read()
    const rewrite = resolveEnterRewrite(keyFacts(event, recentlyComposing()), settings.mode, settings.combo)
    if (rewrite === null) return
    if (rewrite.shiftKey !== undefined) setModifier(event, 'shiftKey', rewrite.shiftKey, warned)
    if (rewrite.ctrlKey !== undefined) setModifier(event, 'ctrlKey', rewrite.ctrlKey, warned)
    if (rewrite.metaKey !== undefined) setModifier(event, 'metaKey', rewrite.metaKey, warned)
  }

  const options: AddEventListenerOptions = { capture: true }
  document.addEventListener('keydown', onKeyDown, options)
  document.addEventListener('compositionstart', onCompositionStart, options)
  document.addEventListener('compositionend', onCompositionEnd, options)
  return () => {
    document.removeEventListener('keydown', onKeyDown, options)
    document.removeEventListener('compositionstart', onCompositionStart, options)
    document.removeEventListener('compositionend', onCompositionEnd, options)
  }
}
