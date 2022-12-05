function useHistoryStateNavigation(base) {
  const { history, location } = window

  const historyState = { value: history.state }

  function changeLocation(to, state, replace) {
    // ! 原理，使用 history 的方法
    history[replace ? 'replaceState' : 'pushState'](state, '', url)
    historyState.value = state
  }
}
function useHistoryListeners(options) {}

export function createWebHistory(base) {
  // 处理base
  base = normalizeBase(base)

  const historyNavigation = useHistoryStateNavigation(base)
  const historyListeners = useHistoryListeners(
    base,
    historyNavigation.state,
    historyNavigation.location,
    historyNavigation.replace
  )

  function go(delta) {
    history.go(delta)
  }

  const routerHistory = Object.assign(
    {
      location: '',
      base,
      go
    },
    // 此处是两个use函数的返回
    // useHistoryStateNavigation(base)
    historyNavigation,
    // useHistoryListeners(base)
    historyListeners
  )

  return routerHistory
}
