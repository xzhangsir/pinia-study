import { inject, getCurrentInstance, effectScope, reactive } from 'vue'
import { SymbolPinia } from './rootStore'

export function defineStore(idOrOptions, setup) {
  let id
  let options
  if (typeof idOrOptions === 'string') {
    id = idOrOptions
    options = setup
  } else {
    id = idOrOptions.id
    options = idOrOptions
  }

  function useStore() {
    const currentInstance = getCurrentInstance()
    // 注册了一个store
    const pinia = currentInstance && inject(SymbolPinia)

    if (!pinia._s.has(id)) {
      createOptionsStore(id, options, pinia)
    }
    const store = pinia._s.get(id)
    return store
  }

  return useStore
}

function createOptionsStore(id, options, pinia) {
  let { state, getters, actions } = options
  let scope
  const store = reactive({})
  function setup() {
    pinia.state.value[id] = state ? state() : {}

    const localState = pinia.state.value[id]
    // console.log(localState)
    return localState
  }

  // _e 可以停止所有的store
  // 每个store 可以停止自己的
  const setupStore = pinia._e.run(() => {
    scope = effectScope()
    return scope.run(() => setup())
  })

  Object.assign(store, setupStore)

  pinia._s.set(id, store)

  // console.log(store)
}
