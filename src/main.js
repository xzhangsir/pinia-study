import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// import { createPinia } from 'pinia'
import { createPinia } from '@/pinia'

const app = createApp(App)

const pinia = createPinia()

pinia.use(function ({ store, pinia }) {
  // console.log('arguments', arguments)
  const key = `pinia_state_${store.$id}`
  let session = sessionStorage.getItem(key)
  if (session) {
    store.$state = JSON.parse(session)
  }
  store.$subscribe((mutation, state) => {
    console.log(state)
    sessionStorage.setItem(key, JSON.stringify(state))
  })
})

app.use(pinia)

app.mount('#app')

// vuex的缺点 :TS 兼容性不好 命名空间问题（只有一个store） mutation和action的区别
// pinia优点：TS兼容性好  不需要命名空间（可以创建store） mutation删掉了  体积小了
