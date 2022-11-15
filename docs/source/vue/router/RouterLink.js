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
