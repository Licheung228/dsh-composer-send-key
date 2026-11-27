import { CTRL_COMBO, DEFAULT_COMBO, DEFAULT_MODE, EDIT_FRIENDLY_MODE } from './constants.js'
import type { SettingsValue } from './types.js'

/** Narrow arbitrary settings-document data to the two supported preferences. */
export function readSettings(value: unknown): SettingsValue {
  const record = typeof value === 'object' && value !== null ? value as Record<string, unknown> : {}
  return {
    mode: record.mode === EDIT_FRIENDLY_MODE ? EDIT_FRIENDLY_MODE : DEFAULT_MODE,
    combo: record.combo === CTRL_COMBO ? CTRL_COMBO : DEFAULT_COMBO,
  }
}
