import { routerKey, routerViewLocationKey } from './injectionSymbol'
import RouterLink from './RouterLink'
import RouterView from './RouterView'

export function createRouter(options) {
  // 定义一系列路由器的方法
  function addRoute() {}
  function removeRoute() {}
  function getRoutes() {}
  function hasRoute() {}
  function resolve() {}
  function push() {}
  function replace() {}
  function navigate() {}
  function go() {}

  // 浅响应的当前路由
  const currentRoute = shallowRef({
    path: '/',
    name: undefined,
    params: {},
    query: {},
    hash: '',
    fullPath: '/',
    matched: [],
    meta: {},
    redirectedFrom: undefined
  })
  const installedApps = new Set()

  // 路由器实例
  const router = {
    currentRoute,
    listening: true,

    addRoute,
    removeRoute,
    hasRoute,
    getRoutes,
    resolve,
    options,

    push,
    replace,
    go,
    back: () => go(-1),
    forward: () => go(1),

    // 全局路由拦截器
    beforeEach: () => {},
    beforeResolve: () => {},
    afterEach: () => {},

    // 插件注册
    install(app) {
      const router = this
      // 注册路由的全局组件
      app.component('RouterLink', RouterLink)
      app.component('RouterView', RouterView)

      // 配置挂载  $router
      app.config.globalProperties.$router = router
      Object.defineProperty(app.config.globalProperties, '$route', {
        enumerable: true,
        get: () => unref(currentRoute)
      })

      app.provide(routerKey, router)
      app.provide(routerViewLocationKey, currentRoute)

      const unmountApp = app.unmount
      installedApps.add(app)
      // 处理卸载
      app.unmount = function () {}
    }
  }
  return router
}
