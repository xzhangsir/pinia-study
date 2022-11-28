import { defineStore } from '@/pinia'

export const useFruits = defineStore('fruits', {
  state: () => {
    return {
      fruits: ['苹果', '西瓜'],
      vegetables: ['土豆', '辣椒']
    }
  }
})
