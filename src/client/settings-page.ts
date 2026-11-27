import {
  COMBO_RADIO_NAME, CTRL_COMBO, DEFAULT_COMBO, DEFAULT_MODE, EDIT_FRIENDLY_MODE, MODE_RADIO_NAME,
} from '../constants.js'
import type { CreateElement, Mode, SendCombo, SettingsPageProps, Translate } from '../types.js'

interface ModeOptionInput {
  h: CreateElement
  id: 'default' | 'edit-friendly'
  title: string
  checked: boolean
  keys: unknown
  onSelect: () => void
}

interface ComboChipInput {
  h: CreateElement
  id: SendCombo
  label: string
  checked: boolean
  onSelect: () => void
}

interface KeyLineInput {
  h: CreateElement
  t: Translate
  prefix: string
  sendKey: string
  newlineKey: string
}

function keyCap(h: CreateElement, id: string, text: string): unknown {
  return h('kbd', { className: 'csk-kbd', 'data-el-id': id }, text)
}

function action(h: CreateElement, id: string, text: string): unknown {
  return h('span', { className: 'csk-action', 'data-el-id': id }, text)
}

function keyLine({ h, t, prefix, sendKey, newlineKey }: KeyLineInput): unknown {
  return h('span', { className: 'csk-keys', 'data-el-id': `${prefix}-keys` },
    h('span', { className: 'csk-pair', 'data-el-id': `${prefix}-pair-send` },
      keyCap(h, `${prefix}-kbd-send`, sendKey),
      action(h, `${prefix}-action-send`, t('action.send')),
    ),
    h('span', { className: 'csk-pair', 'data-el-id': `${prefix}-pair-newline` },
      keyCap(h, `${prefix}-kbd-newline`, newlineKey),
      action(h, `${prefix}-action-newline`, t('action.newline')),
    ),
  )
}

function renderModeOption({ h, id, title, checked, keys, onSelect }: ModeOptionInput): unknown {
  return h('label', { className: 'csk-option', 'data-el-id': `csk-option-${id}` },
    h('input', {
      className: 'csk-radio',
      'data-el-id': `csk-radio-${id}`,
      type: 'radio',
      name: MODE_RADIO_NAME,
      value: id,
      checked,
      onChange: onSelect,
    }),
    h('span', { className: 'csk-title', 'data-el-id': `csk-title-${id}` }, title),
    keys,
  )
}

function renderComboChip({ h, id, label, checked, onSelect }: ComboChipInput): unknown {
  return h('label', {
    className: checked ? 'csk-chip csk-chip-selected' : 'csk-chip',
    'data-el-id': `csk-combo-${id}`,
  },
    h('input', {
      className: 'csk-radio',
      'data-el-id': `csk-combo-radio-${id}`,
      type: 'radio',
      name: COMBO_RADIO_NAME,
      value: id,
      checked,
      onChange: onSelect,
    }),
    keyCap(h, `csk-combo-kbd-${id}`, label),
  )
}

/**
 * Settings → Send shortcut. The nav label names the page, so the page itself
 * carries only the choice: two behaviors with their key line, and the combo
 * choices nested under the behavior that uses them.
 */
export function createSettingsPage(h: CreateElement) {
  return function SettingsPage(props: SettingsPageProps): unknown {
    const { useMode, useCombo, useSaveError, setMode, setCombo, t } = props
    const mode = useMode((value: Mode) => value)
    const combo = useCombo((value: SendCombo) => value)
    const saveError = useSaveError((value: string) => value)
    const editFriendly = mode === EDIT_FRIENDLY_MODE
    const comboLabel = combo === CTRL_COMBO ? 'Ctrl + Enter' : 'Shift + Enter'

    return h('section', { className: 'csk-section', 'data-el-id': 'csk-section' },
      h('div', { className: 'csk-card', 'data-el-id': 'csk-card' },
        h('div', {
          className: 'csk-options',
          'data-el-id': 'csk-options',
          role: 'radiogroup',
          'aria-label': t('mode.label'),
        },
          renderModeOption({
            h,
            id: 'default',
            title: t('mode.default'),
            checked: mode === DEFAULT_MODE,
            keys: keyLine({
              h,
              t,
              prefix: 'csk-default',
              sendKey: 'Enter',
              newlineKey: 'Shift + Enter',
            }),
            onSelect: () => { setMode(DEFAULT_MODE) },
          }),
          renderModeOption({
            h,
            id: 'edit-friendly',
            title: t('mode.editFriendly'),
            checked: editFriendly,
            keys: keyLine({
              h,
              t,
              prefix: 'csk-edit',
              sendKey: comboLabel,
              newlineKey: 'Enter',
            }),
            onSelect: () => { setMode(EDIT_FRIENDLY_MODE) },
          }),
        ),
        editFriendly
          ? h('div', {
            className: 'csk-combo',
            'data-el-id': 'csk-combo',
            role: 'radiogroup',
            'aria-label': t('combo.label'),
          },
            renderComboChip({
              h,
              id: DEFAULT_COMBO,
              label: 'Shift + Enter',
              checked: combo === DEFAULT_COMBO,
              onSelect: () => { setCombo(DEFAULT_COMBO) },
            }),
            renderComboChip({
              h,
              id: CTRL_COMBO,
              label: 'Ctrl + Enter',
              checked: combo === CTRL_COMBO,
              onSelect: () => { setCombo(CTRL_COMBO) },
            }),
          )
          : null,
      ),
      saveError === ''
        ? null
        : h('p', { className: 'csk-error', 'data-el-id': 'csk-error', role: 'status' }, saveError),
    )
  }
}
