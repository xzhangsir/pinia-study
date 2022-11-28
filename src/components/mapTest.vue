<script>
import { mapState, mapActions, mapWritableState } from "@/pinia";
import { useCounterStore } from "../stores/counter";
import { useFruits } from "../stores/fruits";
export default {
  computed:{
    // 对象和数组两种写法
    ...mapState(useCounterStore, ['count',"doubleCount"]),
    // ...mapState(useFruits,{
    //   fruits: "fruits",
    //   vegetables: "vegetables"
    // })
    // 可读可直接改
    ...mapWritableState(useFruits,{
      newFruits: "fruits"  
    })
  },
  methods:{
    ...mapActions(useCounterStore, ['increment']),
    newAddFruits(){
      this.newFruits.push("柚子")
    }
  }
}
</script>
<template>
  <button @click = "increment">加一</button>
  <div>{{ count }}</div>
  <div>{{ doubleCount }}</div>
  <div class="flex" style="justify-content: space-around;">
    <div>
      <div v-for="item in fruits" :key="item">
        {{ item }}
      </div>
    </div>
    <div>
      <div v-for="item in vegetables" :key="item">
        {{ item }}
      </div>
    </div>
  </div>
  <div @click="newAddFruits">新加的水果</div>
  <div v-for="item in newFruits" :key="item">
    {{ item }}
  </div>
</template>
<style>
.flex{
  display: flex;
}
</style>