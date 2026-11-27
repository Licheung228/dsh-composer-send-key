/**
 * Host half of composer-send-key.
 *
 * Two volatile preferences, `mode` and `combo`, persist through the profile's
 * settings document. The Client half reads and writes them through
 * `ctx.configForms` under this entry's profile id, `composer-send-key`; volatile
 * writes apply live without restarting the plugin.
 */
import z from '@deepseek-ai/schemastery'
import type { HostContext } from './types.js'

export const Config = z.object({
  mode: z.union(['default', 'edit-friendly']).default('default').volatile(),
  combo: z.union(['shift', 'ctrl']).default('shift').volatile(),
})

/** Register the settings persistence policy; run without Settings when absent. */
export function apply(ctx: HostContext): void {
  ctx.inject(['settings'], (child) => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber))
  })
}
