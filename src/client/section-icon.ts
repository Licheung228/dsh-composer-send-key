import type { CreateElement, SettingsSectionIconProps } from '../types.js'

/** A return arrow: the shared Enter/send glyph for the settings tab. */
export function createSectionIcon(h: CreateElement) {
  return function SectionIcon({ size, active }: SettingsSectionIconProps): unknown {
    const stroke = {
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: active ? 1.75 : 1.5,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }
    return h('svg', {
      'data-el-id': 'csk-icon',
      width: size,
      height: size,
      viewBox: '0 0 16 16',
      'aria-hidden': 'true',
      focusable: 'false',
    },
      h('path', {
        'data-el-id': 'csk-icon-corner',
        d: 'M13 3v5a3 3 0 0 1-3 3H4',
        ...stroke,
      }),
      h('path', {
        'data-el-id': 'csk-icon-arrow',
        d: 'M7 8 4 11l3 3',
        ...stroke,
      }),
    )
  }
}
