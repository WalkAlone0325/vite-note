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
