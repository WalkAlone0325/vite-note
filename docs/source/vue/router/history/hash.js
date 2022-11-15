import { createWebHistory } from './html5'

export function createWebHashHistory(base) {
  base = location.hash ? base || location.pathname + location.search : ''

  // ! 重点，history 模式没有 # 补上 # 就是 hash 模式
  if (!base.includes('#')) base += '#'

  return createWebHistory(base)
}
