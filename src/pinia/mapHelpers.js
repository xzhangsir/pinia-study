export function mapState(useStore, keysOrMapper) {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce((reduced, key) => {
        reduced[key] = function () {
          return useStore()[key]
        }
        return reduced
      }, {})
    : Object.keys(keysOrMapper).reduce((reduced, key) => {
        reduced[key] = function () {
          const store = useStore()
          const storeKey = keysOrMapper[key]
          return store[storeKey]
        }
        return reduced
      }, {})
}

export function mapActions(useStore, keysOrMapper) {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce((reduced, key) => {
        reduced[key] = function (...args) {
          return useStore()[key](...args)
        }
        return reduced
      }, {})
    : Object.keys(keysOrMapper).reduce((reduced, key) => {
        reduced[key] = function (...args) {
          const store = useStore()
          const storeKey = keysOrMapper[key]
          return store[storeKey](...args)
        }
        return reduced
      }, {})
}

// 可读可写
export function mapWritableState(useStore, keysOrMapper) {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce((reduced, key) => {
        reduced[key] = {
          get() {
            return useStore()[key]
          },
          set(value) {
            useStore()[key] = value
          }
        }
        return reduced
      }, {})
    : Object.keys(keysOrMapper).reduce((reduced, key) => {
        reduced[key] = {
          get() {
            const store = useStore()
            const storeKey = keysOrMapper[key]
            return store[storeKey]
          },
          set(val) {
            const store = useStore()
            const storeKey = keysOrMapper[key]
            store[storeKey] = val
          }
        }
        return reduced
      }, {})
}
