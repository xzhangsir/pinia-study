import { effectScope, markRaw, ref } from 'vue'
import { SymbolPinia } from './rootStore'

export function createPinia() {
  const scope = effectScope(true)

  const state = scope.run(() => ref({}))

  const pinia = markRaw({
    install(app) {
      pinia._a = app
      // pinia  希望能被共享出去
      // 将pinia的实例暴露到app上，所有的组件都可以通过inject注入进来
      app.provide(SymbolPinia, pinia)
      // 兼容vue2 this.$pinia 可以访问到
      app.config.globalProperties.$pinia = pinia
    },
    _a: null,
    state, //所有的状态
    _e: scope, // 用来管理这个应用的effectScope
    _s: new Map() //记录所有的store
  })

  return pinia
}
