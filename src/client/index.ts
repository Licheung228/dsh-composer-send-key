import { PLUGIN_ID } from '../constants.js'
import type { ClientContext, CreateElement, ReactModule } from '../types.js'
import { createRuntime } from './runtime.js'

interface ClientModuleDefinition {
  id: string
  factory: (modules: (id: string) => unknown) => unknown
}

interface ModuleLoader {
  load: (definition: ClientModuleDefinition) => void
}

const loader = (globalThis as unknown as { __ModuleLoader__: ModuleLoader }).__ModuleLoader__

loader.load({
  id: PLUGIN_ID,
  factory(modules) {
    const react = modules('react') as ReactModule
    const createElement: CreateElement = react.createElement
    return {
      inject: ['slots', 'locale', 'configForms'],
      apply(ctx: ClientContext): void {
        createRuntime(ctx, createElement)
      },
    }
  },
})
