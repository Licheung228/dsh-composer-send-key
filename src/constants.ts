import type { Mode, SendCombo } from './types.js'

/** Client module id; the loader keys the factory by this string. */
export const PLUGIN_ID = 'dsh-composer-send-key'

/** Locale namespace and volatile settings namespace share the profile entry id. */
export const LOCALE_NS = 'composer-send-key'

/** Volatile config fields inside the `composer-send-key` entry. */
export const MODE_FIELD = 'mode'
export const COMBO_FIELD = 'combo'

export const DEFAULT_MODE: Mode = 'default'
export const EDIT_FRIENDLY_MODE: Mode = 'edit-friendly'
export const DEFAULT_COMBO: SendCombo = 'shift'
export const CTRL_COMBO: SendCombo = 'ctrl'

/** Settings tab identity in the host's settings shell. */
export const SETTINGS_SECTION_ID = 'composer-send-key'
export const SETTINGS_SECTION_ORDER = 5

/** The message composer's card; only its editor is in scope. */
export const COMPOSER_CARD_SELECTOR = '[data-composer-card]'

/** Surfaces that own Enter independently of the message composer. */
export const NON_COMPOSER_SELECTOR = '.xterm, [data-sidebar-terminal], input, textarea, select'

export const MODE_RADIO_NAME = 'dsh-composer-send-key-mode'
export const COMBO_RADIO_NAME = 'dsh-composer-send-key-combo'

/** Allow the IME-closing keydown to be routed before component state clears. */
export const COMPOSITION_GUARD_MS = 10
