import { effectScope, getCurrentInstance, inject, reactive } from 'vue'
import { SymbolPinia } from './rootStore'

export function defineStore(idOrOptions, setup) {
  let id
  let options
  if (typeof idOrOptions === 'string') {
    id = idOrOptions
    options = setup
  } else {
    options = idOrOptions
    id = idOrOptions.id
  }

  function useStore() {
    //获取使用这个store的组件实例
    const currentInstance = getCurrentInstance()
    // 注册了一个store
    const pinia = currentInstance && inject(SymbolPinia)
    console.log('pinia', pinia)
    if (!pinia._s.has(id)) {
      // 如果pinia._s中没有记录过这个store 就去创建一个
      createOptionsStore(id, options, pinia)
    }
    const store = pinia._s.get(id)
    return store
  }

  return useStore
}

function createOptionsStore(id, options, pinia) {
  let { state, getters, actions } = options
  console.log(state)
  console.log(getters)
  console.log(actions)
  let scope
  const store = reactive({})
  function setup() {
    pinia.state.value[id] = state ? state() : {}
    console.log(pinia.state)
    const localState = pinia.state.value[id]
    return localState
  }
  // pinia._e 可以停止所有的store
  // 每个store 可以停止自己的
  const setupStore = pinia._e.run(() => {
    scope = effectScope()
    return scope.run(() => setup())
  })

  Object.assign(store, setupStore)

  pinia._s.set(id, store)
}
