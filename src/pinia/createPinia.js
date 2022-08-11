import { markRaw, effectScope, ref } from 'vue'
import { setActivePinia, SymbolPinia } from './rootStore'

export function createPinia() {
  const scope = effectScope(true)

  const state = scope.run(() => ref({}))
  const _p = []
  const pinia = markRaw({
    install(app) {
      setActivePinia(pinia)
      pinia._a = app
      // pinia  希望能被共享出去
      // 将pinia的实例暴露到app上，所有的组件都可以通过inject注入进来
      app.provide(SymbolPinia, pinia)
      // 兼容vue2
      app.config.globalProperties.$pinia = pinia
    },
    use(plugin) {
      _p.push(plugin)
      return this
    },
    _p,
    _a: null,
    state, //所有的状态
    _e: scope, // 用来管理这个应用的effectScope
    _s: new Map() //记录所有的store
  })

  return pinia
}
