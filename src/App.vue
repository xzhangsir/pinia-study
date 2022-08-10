<script setup>
import HelloWorld from './components/HelloWorld.vue'

import { useCounterStore } from "./stores/counter"

const store = useCounterStore()
// store.increment()
const handleClick = ()=>{
 /*  store.count++
  store.fruits.push("葡萄") */
  store.increment()


  //批量修改 对象方式
 /* let fruits = [...store.fruits,"葡萄"]
  store.$patch({
    count:store.count + 1,
    fruits
  }) */
  //批量修改 函数方式
/*   store.$patch(()=>{
    store.count++;
    store.fruits = [...store.fruits, "葡萄"]
  }) */

  // 重置
  /* store.$reset() */
  
}
// 监控状态变化
store.$subscribe((mutation,state)=>{
  console.log("数据变化了",state)
})
// 监控用户有没有调用 action
store.$onAction(({ after, onError ,name})=>{
  console.log("action",name)
  after((res)=>{
    console.log("状态更新完毕", res)
  })
  onError((err)=>{
    console.log("error了",err)
  })
})
</script>

<template>
  <div>{{ store.count}}</div>
  <div>{{ store.doubleCount}}</div>
  <button @click="handleClick">加一</button>
  <div v-for="item in store.fruits" :key = "item">
    {{item}}
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
