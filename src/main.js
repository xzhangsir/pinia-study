import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// import { createPinia } from 'pinia'
import { createPinia } from '@/pinia'

const app = createApp(App)

/* const Plugin = {
  install(app) {
    console.log(app)
  }
}

app.use(Plugin) //use会去调用 plugin的install方法
 */
const pinia = createPinia()
pinia.use(function ({ store }) {
  let session = sessionStorage.getItem('state')
  if (session) {
    store.$state = JSON.parse(session)
  }
  //给pinia注入插件
  // console.log(arguments)
  store.$subscribe((mutation, state) => {
    console.log(state)
    sessionStorage.setItem('state', JSON.stringify(state))
  })
})
app.use(pinia)

app.mount('#app')

// render(h(App),"#app")

// vuex的缺点 :TS 兼容性不好 命名空间问题（只有一个store） mutation和action的区别

// pinia优点：TS兼容性好  不需要命名空间（可以创建store） mutation删掉了  小了
