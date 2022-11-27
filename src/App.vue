<script setup>
  import { useCounterStore } from "./stores/counter"

  const store = useCounterStore()

  const handleClick = () => {
    store.increment()
  }
</script>

<template>
  <div>{{ store.count}}</div>
  <div>{{ store.doubleCount }}</div>
  <button @click="handleClick">加一</button>
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
