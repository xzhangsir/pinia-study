import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { createPinia } from 'pinia'

const app = createApp(App)

/* const Plugin = {
  install(app) {
    console.log(app)
  }
}

app.use(Plugin) //use会去调用 plugin的install方法
 */

app.use(createPinia())

app.mount('#app')

// render(h(App),"#app")

// vuex的缺点 :TS 兼容性不好 命名空间问题（只有一个store） mutation和action的区别

// pinia优点：TS兼容性好  不需要命名空间（可以创建store） mutation删掉了  小了
