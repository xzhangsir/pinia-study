// import { defineStore } from 'pinia'
import { defineStore } from '@/pinia'
import { computed, reactive, toRefs } from 'vue'

// optionStore 写法
export const useCounterStore = defineStore('counter', {
  state: () => {
    return { count: 1 }
  },
  getters: {
    doubleCount: (store) => store.count * 2
  },
  actions: {
    increment() {
      this.count++
      return 123
    }
  }
})

// setupStore写法
/* export const useCounterStore = defineStore('counter', () => {
  const state = reactive({ count: 1 })
  const doubleCount = computed(() => state.count * 2)
  const increment = () => state.count++
  return {
    ...toRefs(state),
    doubleCount,
    increment
  }
})
 */
