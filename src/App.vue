<script setup>
  import { useCounterStore } from "./stores/counter"
  import { useFruits } from "./stores/fruits"

  const store = useCounterStore()

  const handleClick = () => {
    store.increment()


    setTimeout(() => {
      store.$dispose()
    }, 1000)
  }

  const fruitsStore = useFruits()
  const addFruits = ()=>{
    /* fruitsStore.fruits.push("菠萝")
    fruitsStore.vegetables.push("笋") */

  /*    //批量修改 对象方式
    let newFruits = [...fruitsStore.fruits,"菠萝"]
    let newVegetables = [...fruitsStore.vegetables, "笋"]
    fruitsStore.$patch({
      fruits: newFruits,
      vegetables:newVegetables
    }) */

      //批量修改 函数方式
    fruitsStore.$patch(()=>{
        fruitsStore.vegetables.push("红薯")
        fruitsStore.fruits.push("葡萄")
    })

   /*  fruitsStore.$state = {
      vegetables: ["橘子"]
    }
     */

  }


  const reset = ()=>{
    // 只能用于optionStore
    fruitsStore.$reset()
    // 不能用于setupStore
    // store.$reset()
  }

  // 监控状态变化
  fruitsStore.$subscribe((mutation, state) => {
    console.log("数据变化了", state, mutation)
  })

// 监控用户有没有调用 action
store.$onAction(({ after, onError, name }) => {
  console.log("action", name)
  after((res) => {
    console.log("状态更新完毕", res)
  })
  onError((err) => {
    console.log("error了", err)
  })
})
    
</script>

<template>
  <div>{{ store.count}}</div>
  <div>{{ store.doubleCount }}</div>
  <button @click="handleClick">加一</button>
  <button @click = "reset">重置</button>
  <button @click="addFruits">添加水果和蔬菜</button>
  <div class = "flex" style = "justify-content: space-around;">
      <div>
          <div v-for="item in fruitsStore.fruits" :key="item">
            {{item}}
          </div>
      </div>
      <div>
        <div v-for="item in fruitsStore.vegetables" :key="item">
          {{item}}
        </div>
      </div>
  </div>
</template>

<style scoped>
.flex{
  display: flex;
}
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
