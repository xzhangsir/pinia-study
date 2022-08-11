import {
  inject,
  getCurrentInstance,
  computed,
  effectScope,
  reactive,
  toRefs,
  isRef,
  watch
} from 'vue'
import { addSubscription, triggerSubscription } from './pubSub'
import { activePinia, setActivePinia, SymbolPinia } from './rootStore'

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
    let pinia = currentInstance && inject(SymbolPinia)

    if (pinia) setActivePinia(pinia)
    pinia = activePinia

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
  let scope
  const setupStore = pinia._e.run(() => {
    scope = effectScope()
    return scope.run(() => setup())
  })

  function wrapAction(name, action) {
    return function () {
      const afterCallbackList = []
      const onErrorCallbackList = []
      function after(callback) {
        afterCallbackList.push(callback)
      }
      function onError(callback) {
        onErrorCallbackList.push(callback)
      }

      triggerSubscription(actionSubscribes, { after, onError, store, name })
      let ret
      try {
        ret = action.apply(store, arguments)
        // triggerSubscription(afterCallbackList, ret)
      } catch (error) {
        triggerSubscription(onErrorCallbackList, error)
      }

      if (ret instanceof Promise) {
        return ret
          .then((val) => {
            triggerSubscription(afterCallbackList, val)
          })
          .catch((error) => {
            triggerSubscription(onErrorCallbackList, error)
            return Promise.reject(error)
          })
      } else {
        triggerSubscription(afterCallbackList, ret)
      }

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

  function $patch(partialStoreOrMutaion) {
    if (typeof partialStoreOrMutaion === 'function') {
      partialStoreOrMutaion(store)
    } else {
      mergeReactiveObject(store, partialStoreOrMutaion)
    }
  }

  let actionSubscribes = []

  const partialStore = {
    $patch,
    // 当用户状态变化的时候 可以监控到变化 并且通知用户 发布订阅
    $subscribe(callback, options) {
      // 等同于 watch
      scope.run(() =>
        watch(
          pinia.state.value[id],
          (state) => {
            callback({ type: '' }, state)
          },
          options
        )
      )
    },
    $onAction: addSubscription.bind(null, actionSubscribes),
    $dispose: () => {
      scope.stop()
      actionSubscribes = []
      pinia._s.delete(id)
    }
  }

  const store = reactive(partialStore)

  Object.defineProperty(store, '$state', {
    get: () => pinia.state.value[id],
    set: (state) => $patch(($state) => Object.assign($state, state))
  })

  Object.assign(store, setupStore)

  pinia._p.forEach((plugin) =>
    Object.assign(store, plugin({ store, pinia, app: pinia._a }))
  )

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
  store.$reset = function () {
    const newState = state ? state() : {}
    store.$patch((state) => {
      Object.assign(state, newState)
    })
  }

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

function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}
function mergeReactiveObject(target, partialStore) {
  for (let key in partialStore) {
    // 如果是原型上的 不能合并
    if (!partialStore.hasOwnProperty(key)) continue

    const oldVal = target[key]
    const newVal = partialStore[key]

    // 状态有可能是REF  ref也不能递归
    if (isObject(oldVal) && isObject(newVal) && isRef(newVal)) {
      target[key] = mergeReactiveObject(oldVal, newVal)
    } else {
      target[key] = newVal
    }
  }
  return target
}

// $patch $subscribe $onAction $dispose $reset
