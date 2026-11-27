import type { Dictionary, LocaleKey } from '../types.js'

export const en: Dictionary = {
  nav: 'Send shortcut',
  'mode.default': 'Default',
  'mode.editFriendly': 'Edit-friendly',
  'mode.label': 'Send mode',
  'combo.label': 'Shortcut key',
  'action.send': 'Sends',
  'action.newline': 'New line',
  saveFailed: 'Could not save; the change applies to this session only.',
}

export const zh: Dictionary = {
  nav: '发送快捷键',
  'mode.default': '默认',
  'mode.editFriendly': '编辑友好模式',
  'mode.label': '发送模式',
  'combo.label': '组合键',
  'action.send': '发送',
  'action.newline': '换行',
  saveFailed: '保存失败，本次修改仅在当前会话生效。',
}

export const DICTIONARIES: Record<string, Dictionary> = { en, zh }

export type { LocaleKey }
