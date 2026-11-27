/** The two send behaviors the plugin offers. */
export type Mode = 'default' | 'edit-friendly'

/** The key that sends while edit-friendly mode leaves plain Enter for newlines. */
export type SendCombo = 'shift' | 'ctrl'

/** Persisted preference pair read from the settings document. */
export interface SettingsValue {
  mode: Mode
  combo: SendCombo
}

/** Keyboard facts the decision needs; everything else about the event is irrelevant. */
export interface KeyFacts {
  key: string
  shiftKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  altKey: boolean
  altGraph: boolean
  composing: boolean
}

/** Modifiers to replace on the original event; absent fields stay untouched. */
export interface KeyRewrite {
  shiftKey?: boolean
  ctrlKey?: boolean
}

/** Minimal observable the slot renderer binds into React hooks. */
export interface Store<T> {
  getSnapshot: () => T
  subscribe: (listener: () => void) => () => void
}

/** Copy keys the client owns. */
export type LocaleKey =
  | 'nav'
  | 'mode.default'
  | 'mode.editFriendly'
  | 'mode.label'
  | 'combo.label'
  | 'action.send'
  | 'action.newline'
  | 'saveFailed'

/** Translate one owned key. */
export type Translate = (key: LocaleKey) => string

/** One locale's complete dictionary. */
export type Dictionary = Record<LocaleKey, string>

/** The browser module table entry the client bundle asks for. */
export interface ReactModule {
  createElement: (
    type: unknown,
    props?: Record<string, unknown> | null,
    ...children: unknown[]
  ) => unknown
}

/** React element factory used by the settings page. */
export type CreateElement = ReactModule['createElement']

/** Props the slot renderer passes to the section component. */
export interface SettingsPageProps {
  useMode: <T>(select: (value: Mode) => T) => T
  useCombo: <T>(select: (value: SendCombo) => T) => T
  useSaveError: <T>(select: (value: string) => T) => T
  setMode: (mode: Mode) => void
  setCombo: (combo: SendCombo) => void
  t: Translate
}

/** Live snapshot of one volatile settings namespace. */
export interface ConfigForm {
  getSnapshot: () => { value: unknown }
  subscribe: (listener: () => void) => () => void
  set: (field: string, value: unknown) => Promise<boolean>
}

/** Client locale service surface the plugin uses. */
export interface LocaleService {
  register: (namespace: string, dictionaries: Record<string, Dictionary>) => () => void
  bind: (namespace: string) => Translate
}

/** One slot registration. */
export interface SlotRegistration {
  name: string
  id: string
  order?: number
  label?: () => string
  locale?: string
  inject?: () => Record<string, unknown>
}

/** Client slots service surface the plugin uses. */
export interface SlotsService {
  inject: (name: string, callback: () => void) => void
  register: (options: SlotRegistration, component: unknown) => unknown
}

/** Client context surface the plugin uses. */
export interface ClientContext {
  effect: (callback: () => void | (() => void), label?: string) => void
  locale: LocaleService
  configForms?: { get: (namespace: string) => ConfigForm | undefined }
  slots: SlotsService
}

/** Host context surface the plugin uses. */
export interface HostContext {
  inject: (services: string[], callback: (child: HostSettingsContext) => void) => void
  fiber: unknown
}

/** Host settings service surface the plugin uses. */
export interface HostSettingsContext {
  effect: (callback: () => void | (() => void), label?: string) => void
  settings: {
    configure: (options: { auto: boolean }, owner: unknown) => () => void
  }
}
