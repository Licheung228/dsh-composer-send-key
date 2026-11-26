/**
 * Client half of composer-send-key.
 *
 * Two contributions:
 * 1. A Settings → General preference row (`settings.general.item`) switching
 *    between `default` (Enter sends, Shift+Enter newlines) and
 *    `edit-friendly` (Enter newlines, Shift+Enter sends). The value lives in
 *    the volatile `mode` field of this entry's settings namespace, so writes
 *    persist in the profile and apply live.
 * 2. A capture-phase keydown listener that, only in edit-friendly mode and
 *    only inside the composer's contenteditable, swaps the Shift modifier of
 *    plain Enter / Shift+Enter before the composer's own Lexical keymap sees
 *    the event. Every downstream guard (busy state, command-menu arbitration,
 *    IME composition, held-key repeat) keeps its shipped behavior because the
 *    original event continues unchanged otherwise; in default mode the
 *    listener never touches anything.
 */
window.__ModuleLoader__.load({
  id: 'dsh-composer-send-key',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'composer-send-key'
    const MODE_FIELD = 'mode'
    const DEFAULT_MODE = 'default'
    const EDIT_FRIENDLY_MODE = 'edit-friendly'

    const dictionaries = {
      en: {
        'row.title': 'Send shortcut',
        'mode.default': 'Default (Enter sends)',
        'mode.editFriendly': 'Edit-friendly (Shift+Enter sends)',
        'row.saveFailed': 'Could not save; the change applies to this session only.',
      },
      zh: {
        'row.title': '发送快捷键',
        'mode.default': '默认模式（Enter 发送）',
        'mode.editFriendly': '编辑友好模式（Shift+Enter 发送）',
        'row.saveFailed': '保存失败，本次修改仅在当前会话生效。',
      },
    }

    const CSS = `
.dsh-csk-row{display:flex;align-items:center;gap:8px;padding:16px 0;border-bottom:.5px solid var(--dsw-alias-border-l2);}
.dsh-csk-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;padding-right:48px;}
@media (max-width:767px){html:not([data-windows-titlebar]):not([data-platform='darwin']) .dsh-csk-text{padding-right:16px;}}
.dsh-csk-title{font-size:14px;font-weight:400;line-height:22px;color:var(--dsw-alias-label-primary);}
.dsh-csk-select{flex:none;height:36px;max-width:260px;padding:0 10px;border:none;border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-module-platform);font:inherit;font-size:14px;line-height:22px;color:var(--dsw-alias-label-primary);cursor:pointer;}
@media (hover:hover){.dsh-csk-select:hover{background:var(--dsw-alias-interactive-bg-hover);}}
.dsh-csk-error{font-size:12px;font-weight:400;line-height:18px;color:var(--dsw-alias-state-error-primary);}
`

    /** Translation fallback when the slot does not project a `t` prop. */
    let fallbackTranslate = (key) => key

    function SendKeyModeRow(props) {
      const useMode = props.useMode
      const useSaveError = props.useSaveError
      const setMode = props.setMode
      const t = props.t ?? fallbackTranslate
      const mode = useMode((value) => value)
      const saveError = useSaveError((value) => value)
      return h(React.Fragment, null,
        h('style', null, CSS),
        h('div', { className: 'dsh-csk-row' },
          h('div', { className: 'dsh-csk-text' },
            h('div', { className: 'dsh-csk-title' }, t('row.title')),
            saveError ? h('div', { className: 'dsh-csk-error', role: 'status' }, saveError) : null),
          h('select', {
            className: 'dsh-csk-select',
            value: mode,
            'aria-label': t('row.title'),
            onChange: (event) => setMode(event.target.value),
          },
            h('option', { value: DEFAULT_MODE }, t('mode.default')),
            h('option', { value: EDIT_FRIENDLY_MODE }, t('mode.editFriendly')))))
    }

    /** The composer's contenteditable root, identified without reading any other plugin's DOM. */
    function isComposerEditable(target) {
      if (!(target instanceof HTMLElement)) return false
      if (!target.isContentEditable) return false
      return target.closest('[data-composer-card]') !== null
    }

    return {
      inject: ['slots', 'locale', 'configForms'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, dictionaries), 'composer-send-key: dictionaries')
        const t = ctx.locale.bind(NS)
        fallbackTranslate = t

        // Live `mode` snapshot over the Host settings document; browser-local
        // default when the namespace is not exposed to this client.
        const form = typeof ctx.configForms?.get === 'function' ? ctx.configForms.get(NS) : undefined
        let mode = DEFAULT_MODE
        const listeners = new Set()
        const publish = () => { for (const listener of [...listeners]) listener() }
        const store = {
          getSnapshot: () => mode,
          subscribe: (listener) => {
            listeners.add(listener)
            return () => { listeners.delete(listener) }
          },
        }
        const adopt = () => {
          const value = form?.getSnapshot().value
          const next = value !== undefined && value !== null && value.mode === EDIT_FRIENDLY_MODE
            ? EDIT_FRIENDLY_MODE
            : DEFAULT_MODE
          if (next !== mode) {
            mode = next
            publish()
          }
        }
        ctx.effect(() => {
          const unsubscribe = form?.subscribe(adopt)
          adopt()
          return unsubscribe
        }, 'composer-send-key: mode adoption')
        let saveError = ''
        const errorListeners = new Set()
        const publishError = () => { for (const listener of [...errorListeners]) listener() }
        const setSaveError = (text) => { if (text !== saveError) { saveError = text; publishError() } }
        const errorStore = {
          getSnapshot: () => saveError,
          subscribe: (listener) => {
            errorListeners.add(listener)
            return () => { errorListeners.delete(listener) }
          },
        }
        const setMode = (next) => {
          if (next !== DEFAULT_MODE && next !== EDIT_FRIENDLY_MODE) return
          if (next === mode) return
          mode = next
          publish()
          if (form === undefined) {
            setSaveError(t('row.saveFailed'))
            return
          }
          void form.set(MODE_FIELD, next).then((accepted) => {
            adopt()
            setSaveError(accepted ? '' : t('row.saveFailed'))
          }, () => {
            adopt()
            setSaveError(t('row.saveFailed'))
          })
        }

        // Capture-phase modifier swap; see the module doc for why this is the
        // only interception point the shipped composer leaves a plugin.
        let composing = false
        let composingUntil = 0
        const isComposing = (event) =>
          event.isComposing || event.keyCode === 229 || composing || Date.now() < composingUntil
        let warnedShiftSwap = false
        const setShift = (event, value) => {
          try {
            Object.defineProperty(event, 'shiftKey', { configurable: true, enumerable: true, get: () => value })
          } catch {
            // An exotic event without a configurable shiftKey would leave the
            // stock behavior in place; surface that once instead of silently
            // keeping Enter = send in edit-friendly mode.
            if (!warnedShiftSwap) {
              warnedShiftSwap = true
              console.warn('[composer-send-key] shiftKey is not configurable; edit-friendly mode is inactive for this event')
            }
          }
        }
        const onCompositionStart = (event) => { if (isComposerEditable(event.target)) composing = true }
        const onCompositionEnd = () => {
          if (!composing) return
          composing = false
          // Safari delivers the composition-closing keydown just after
          // compositionend; hold the guard for one tick, mirroring the
          // composer's own IME window.
          composingUntil = Date.now() + 10
        }
        const onKeyDown = (event) => {
          if (mode !== EDIT_FRIENDLY_MODE) return
          if (event.key !== 'Enter') return
          if (!isComposerEditable(event.target)) return
          if (event.ctrlKey || event.metaKey || event.altKey) return
          if (typeof event.getModifierState === 'function' && event.getModifierState('AltGraph')) return
          // An IME-closing Enter must reach the candidate window unchanged.
          if (isComposing(event)) return
          setShift(event, !event.shiftKey)
        }
        ctx.effect(() => {
          const options = { capture: true }
          document.addEventListener('keydown', onKeyDown, options)
          document.addEventListener('compositionstart', onCompositionStart, options)
          document.addEventListener('compositionend', onCompositionEnd, options)
          return () => {
            document.removeEventListener('keydown', onKeyDown, options)
            document.removeEventListener('compositionstart', onCompositionStart, options)
            document.removeEventListener('compositionend', onCompositionEnd, options)
          }
        }, 'composer-send-key: modifier swap')

        ctx.slots.inject('settings.general.item', () => ctx.slots.register({
          name: 'settings.general.item',
          id: 'composer-send-key-mode',
          order: 21,
          locale: NS,
          inject: () => ({ hooks: { mode: store, saveError: errorStore }, setMode }),
        }, SendKeyModeRow))
      },
    }
  },
})
