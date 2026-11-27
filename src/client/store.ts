import type { Store } from '../types.js'

interface MutableStore<T> extends Store<T> {
  set: (value: T) => void
}

/** Minimal snapshot store: the slot renderer binds it as a React hook. */
export function createStore<T>(initial: T): MutableStore<T> {
  let value = initial
  const listeners = new Set<() => void>()
  return {
    getSnapshot: () => value,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    set: (next) => {
      if (Object.is(next, value)) return
      value = next
      for (const listener of [...listeners]) listener()
    },
  }
}
