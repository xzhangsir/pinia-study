import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// import { createPinia } from 'pinia'
import { createPinia } from '@/pinia'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

app.mount('#app')

// vuex的缺点 :TS 兼容性不好 命名空间问题（只有一个store） mutation和action的区别
// pinia优点：TS兼容性好  不需要命名空间（可以创建store） mutation删掉了  体积小了
