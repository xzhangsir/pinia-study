export function addSubscription(subscription, cb) {
  // 订阅
  subscription.push(cb)
  // 移除订阅
  return function removeSubscription() {
    const idx = subscription.indexOf(cb)
    if (idx > -1) {
      subscription.splice(idx, 1)
    }
  }
}

export function triggerSubscription(subscription, ...args) {
  // 发布
  subscription.forEach((cb) => cb(...args))
}
