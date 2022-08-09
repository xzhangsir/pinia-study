import {
  inject,
  getCurrentInstance,
  computed,
  effectScope,
  reactive,
  toRefs
} from 'vue'
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

  const isSetupStore = typeof setup === 'function'

  function useStore() {
    const currentInstance = getCurrentInstance()
    // 注册了一个store
    const pinia = currentInstance && inject(SymbolPinia)

    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, pinia)
      } else {
        createOptionsStore(id, options, pinia)
      }
    }
    const store = pinia._s.get(id)
    return store
  }

  return useStore
}

function createSetupStore(id, setup, pinia) {
  const store = reactive({})
  let scope
  const setupStore = pinia._e.run(() => {
    scope = effectScope()
    return scope.run(() => setup())
  })

  function wrapAction(name, action) {
    return function () {
      let ret = action.apply(store, arguments)
      return ret
    }
  }

  for (let key in setupStore) {
    const prop = setupStore[key]
    // console.log(prop)
    if (typeof prop === 'function') {
      //对action进行扩展 aop思想
      // console.log(key, prop)
      setupStore[key] = wrapAction(key, prop)
    }
  }

  Object.assign(store, setupStore)

  pinia._s.set(id, store)
  return store
}

function createOptionsStore(id, options, pinia) {
  let { state, getters, actions } = options

  function setup() {
    pinia.state.value[id] = state ? state() : {}
    // console.log(pinia.state.value[id])
    const localState = toRefs(pinia.state.value[id])
    // console.log(localState)
    return Object.assign(
      localState,
      actions,
      Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = computed(() => {
          return getters[name].call(store, store)
        })
        return computedGetters
      }, {})
    )
  }
  const store = createSetupStore(id, setup, pinia)
  return store
}

/* function createOptionsStore(id, options, pinia) {
  let { state, getters, actions } = options
  let scope
  const store = reactive({}) //每个store都是一个响应式对象
  function setup() {
    pinia.state.value[id] = state ? state() : {}
    // console.log(pinia.state.value[id])
    const localState = toRefs(pinia.state.value[id])
    // console.log(localState)
    return Object.assign(
      localState,
      actions,
      Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = computed(() => {
          return getters[name].call(store, store)
        })
        return computedGetters
      }, {})
    )
  }

  // _e 可以停止所有的store
  // 每个store 可以停止自己的
  const setupStore = pinia._e.run(() => {
    scope = effectScope()
    return scope.run(() => setup())
  })

  function wrapAction(name, action) {
    return function () {
      let ret = action.apply(store, arguments)
      return ret
    }
  }

  for (let key in setupStore) {
    const prop = setupStore[key]
    // console.log(prop)
    if (typeof prop === 'function') {
      //对action进行扩展 aop思想
      // console.log(key, prop)
      setupStore[key] = wrapAction(key, prop)
    }
  }

  Object.assign(store, setupStore)

  pinia._s.set(id, store)

  // console.log(store)
} */
