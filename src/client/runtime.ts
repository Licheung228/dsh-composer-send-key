import {
  COMBO_FIELD, LOCALE_NS, MODE_FIELD, SETTINGS_SECTION_ID, SETTINGS_SECTION_ORDER,
} from '../constants.js'
import { readSettings } from '../settings.js'
import type { ClientContext, CreateElement, Mode, SendCombo, SettingsValue } from '../types.js'
import { installComposerKeyGuard } from './keyboard.js'
import { DICTIONARIES } from './locales.js'
import { createSettingsPage } from './settings-page.js'
import { createStore } from './store.js'
import { CSS } from './styles.js'

function installStyle(): () => void {
  const tag = document.createElement('style')
  tag.dataset.plugin = 'dsh-composer-send-key'
  tag.textContent = CSS
  document.head.append(tag)
  return () => { tag.remove() }
}

/**
 * Client half: register the dictionaries, the Settings page and the
 * composer-only key guard. State is derived from the volatile settings
 * document, so the page and the key guard always agree.
 */
export function createRuntime(ctx: ClientContext, h: CreateElement): void {
  ctx.effect(() => ctx.locale.register(LOCALE_NS, DICTIONARIES), 'composer-send-key: dictionaries')
  const t = ctx.locale.bind(LOCALE_NS)

  ctx.effect(installStyle, 'composer-send-key: stylesheet')

  const form = ctx.configForms?.get(LOCALE_NS)
  let settings: SettingsValue = readSettings(form?.getSnapshot().value)
  const modeStore = createStore(settings.mode)
  const comboStore = createStore(settings.combo)
  const errorStore = createStore('')

  const adopt = (): void => {
    const next = readSettings(form?.getSnapshot().value)
    if (next.mode !== settings.mode) modeStore.set(next.mode)
    if (next.combo !== settings.combo) comboStore.set(next.combo)
    settings = next
  }

  ctx.effect(() => {
    const off = form?.subscribe(adopt)
    adopt()
    return off
  }, 'composer-send-key: settings adoption')

  const persist = (field: string, value: unknown): void => {
    if (form === undefined) {
      errorStore.set(t('saveFailed'))
      return
    }
    void form.set(field, value).then((accepted) => {
      adopt()
      errorStore.set(accepted ? '' : t('saveFailed'))
    }, () => {
      adopt()
      errorStore.set(t('saveFailed'))
    })
  }

  const setMode = (next: Mode): void => {
    if (next === settings.mode) return
    settings = { ...settings, mode: next }
    modeStore.set(next)
    persist(MODE_FIELD, next)
  }

  const setCombo = (next: SendCombo): void => {
    if (next === settings.combo) return
    settings = { ...settings, combo: next }
    comboStore.set(next)
    persist(COMBO_FIELD, next)
  }

  ctx.effect(() => installComposerKeyGuard(() => settings), 'composer-send-key: composer key guard')

  const page = createSettingsPage(h)
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: SETTINGS_SECTION_ID,
    order: SETTINGS_SECTION_ORDER,
    label: () => t('nav'),
    inject: () => ({
      hooks: { mode: modeStore, combo: comboStore, saveError: errorStore },
      setMode,
      setCombo,
      t,
    }),
  }, page))
}
