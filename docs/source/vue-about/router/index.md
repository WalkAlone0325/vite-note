# Router 实现

## createRouter 函数创建
1. 创建 `createRouter` 函数
2. 定义路由器实例 方法、拦截器等
3. 构建路由器实例 `router`，并作为 `createRouter` 函数的返回值
4. 创建 `install` 方法以插件形式注册，注册 全局组件（`RouterLink` `RouterView`），注入（`provide`）`router` `route`，配置挂载 `$router` `$route`
5. 最后创建路由卸载函数 `unmount`

```js
import { routerKey, routerViewLocationKey } from './injectionSymbol'

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

```

## useApi `useRouter` `useRoute` `useLink`

使用 `inject` 的方式 注入 `hook`

```js
import { routerKey, routerViewLocationKey } from './injectionSymbol'

export function useRouter() {
  return inject(routerKey)!
}

export function useRoute() {
  return inject(routerViewLocationKey)!
}
```

`useLink` 函数在 `RouterLink` 中

## RouterLink

1. 创建 `RouterLink` 组件，`props` 主要为 `to` （必填，跳转）
2. 使用虚拟函数默认渲染为 `h('a', { href: link.href, onClick: link.navigate }, children)`
3. `children` 通过插槽提供，`const children = slots.default && slots.default(link)`
4. `link` 通过 `reactive(useLink(props))`
5. 创建 `useLink` 函数，接收 `props`，返回 `{ route, href: computed(() => route.value.href), isActive, isExactActive, navigate }`
6. 主要为 `navigate` 函数，点击 `RouterLink` 跳转触发，返回一个 `Promise`
   1. 首先通过 `guardEvent` 函数进行 阻止默认行为和其它键盘鼠标除左键外的组合键的点击
   2. 默认使用 `router.push(to)`，如果有 `replace` 则触发 `router.replace(to)`

```js
import { routerKey, routerViewLocationKey } from './injectionSymbol'

const noop = () => {}

export function useLink(props) {
  const router = inject(routerKey)

  const route = computed(() => router.resolve(unref(props.to)))

  // ! 跳转函数 是一个 Promise
  function navigate(e) {
    // 阻止默认行为 判断是否存在 replace
    if (guardEvent(e)) {
      // 默认 router.push(props.to)
      return router[unref(props.replace) ? 'replace' : 'push'](
        unref(props.to)
      ).catch(noop)
    }

    return Promise.resolve()
  }

  return {
    route,
    href: computed(() => route.value.href),
    // isActive,
    // isExactActive,
    navigate
  }
}

export const RouterLinkImpl = defineComponent({
  name: 'RouterLink',
  props: {
    // 主要参数
    to: {
      type: [String, Object],
      required: true
    }
  },
  useLink,
  setup(props, { slots }) {
    const link = reactive(useLink(props))

    return () => {
      const children = slots.default && slots.default(link)

      // 默认渲染成 a 标签
      return h(
        'a',
        {
          href: link.href,
          // 主要方法 点击跳转
          onClick: link.navigate
        },
        children
      )
    }
  }
})

export const RouterLink = RouterLinkImpl

function guardEvent(e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return
  // don't redirect when preventDefault called
  if (e.defaultPrevented) return
  // 只有左键响应
  if (e.button !== undefined && e.button !== 0) return
  // don't redirect if `target="_blank"`
  // @ts-expect-error getAttribute does exist
  if (e.currentTarget && e.currentTarget.getAttribute) {
    // @ts-expect-error getAttribute exists
    const target = e.currentTarget.getAttribute('target')
    if (/\b_blank\b/i.test(target)) return
  }
  // 阻止默认行为
  if (e.preventDefault) e.preventDefault()

  return true
}
```

## RouterView

1. 注册 `RouterView` 组件，渲染 `slots.default(ViewComponent) || h(ViewComponent)`
2. 重点 `ViewComponent`，表示要渲染的路由组件
   1. 找到当前渲染的路由 `routeToDisplay`，（`props.route || useRoute()`）
   2. 如果有嵌套路由，通过 `route.matched[depth]` 准确找到当前路由
   3. 然后使用 `matchedRoute.components![props.name]` （`props.name` 默认是 `default`）获取当前渲染的组件 `ViewComponent`
   4. ![default](/default.png)
   5. **此处有个疑点：`RouterView` 接收 `name` 属性，默认是 `'default'`，对应上图，但是如何接收自己的 `name`，把上图的 `default` 换成自己的 `name`**
3. 到此获取到了 `ViewComponent`，通过第一步的 插槽 或者 h函数 渲染响应内容

```js
import {
  matchedRouteKey,
  routerViewLocationKey,
  viewDepthKey
} from './injectionSymbol'

export const RouterViewImpl = defineComponent({
  name: 'RouterView',
  // 防止在 RouterView 上定义属性被传入路由内部
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: 'default'
    },
    route: Object
  },

  setup(props, { attrs, slots }) {
    // 当前路由
    const injectedRoute = inject(routerViewLocationKey)
    const routeToDisplay = computed(() => props.route || injectedRoute.value)

    const injectedDepth = inject(viewDepthKey, 0)
    const depth = computed(() => {
      let initialDepth = unref(injectedDepth)
      const { matched } = routeToDisplay.value
      let matchedRoute
      while (
        (matchedRoute = matched[initialDepth]) &&
        !matchedRoute.components
      ) {
        initialDepth++
      }
      return initialDepth
    })
    const matchedRouteRef = computed(
      () => routeToDisplay.value.matched[depth.value]
    )

    // provide(matchedRouteKey, matchedRouteRef)

    return () => {
      // 组件名称
      const currentName = props.name
      // 对应的组件
      const ViewComponent =
        matchedRouteRef.value && matchedRouteRef.value.components[currentName]

      const component = h(
        ViewComponent,
        Object.assign({}, routeProps, attrs, {
          onVnodeUnmounted,
          ref: viewRef
        })
      )

      // h(Component) 或 <component :is="xxx">
      return (slots.default && slots.default(component, route)) || component
    }
  }
})

export const RouterView = RouterViewImpl

/**
 * RouterView 的内容和类型
 * $slots: {
      default?: ({
        Component,
        route,
      }: {
        Component: VNode
        route: RouteLocationNormalizedLoaded
      }) => VNode[]
    }
 */

```

## Router 模式 `history: xx()`

### createWebHashHistory

```js
import { createWebHistory } from './html5'

export function createWebHashHistory(base) {
  base = location.hash ? base || location.pathname + location.search : ''

  // ! 重点，history 模式没有 # 补上 # 就是 hash 模式
  if (!base.includes('#')) base += '#'

  return createWebHistory(base)
}
```

### createWebHistory

```js
function useHistoryStateNavigation(base) {}
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
```

#### useHistoryStateNavigation(base) {}

```js
function useHistoryStateNavigation(base) {
  const { history, location } = window

  const historyState = { value: history.state }

  function changeLocation(to, state, replace) {
    // ! 原理，使用 history 的方法
    history[replace ? 'replaceState' : 'pushState'](state, '', url)
    historyState.value = state
  }
}
```

#### function useHistoryListeners(options) {}

### createMemoryHistory


