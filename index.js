/**
 * Host half of composer-send-key.
 *
 * Declares one volatile preference, `mode`, persisted through the profile's
 * settings document (the same mechanism the built-in Composer Enter row uses).
 * The Client half reads and writes it through `ctx.configForms` under this
 * entry's profile id, `composer-send-key`; volatile writes apply live without
 * restarting the plugin.
 */
import z from '@deepseek-ai/schemastery'

export const Config = z.object({
  mode: z.union(['default', 'edit-friendly']).default('default').volatile(),
})

/** Register the settings persistence policy; run without Settings when absent. */
export function apply(ctx) {
  ctx.inject(['settings'], (child) => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber))
  })
}
