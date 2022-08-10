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

export function triggerSubscription(subscriptions, ...args) {
  // 发布
  subscriptions.forEach((cb) => cb(...args))
}
