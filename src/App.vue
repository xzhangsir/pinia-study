<script>
import { mapState, mapActions, mapWritableState } from "@/pinia";
import { useCounterStore } from "./stores/counter"
export default {
  computed:{
    ...mapState(useCounterStore, ["count", "fruits","doubleCount"]),
    ...mapState(useCounterStore,{
      f:"fruits"
    }),
    // 可读可写 双向的
    ...mapWritableState(useCounterStore, ["count"])
    
    
  },
  methods:{
    ...mapActions(useCounterStore, ['increment'])
  }
}



</script>

<template>
  <div>{{ count}}</div>
  <div>{{ f}}</div>
  <div>{{ doubleCount}}</div>
  <button @click="increment()">加一</button>
  <button @click="count++">加一</button>

  <div v-for="item in fruits" :key="item">
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
