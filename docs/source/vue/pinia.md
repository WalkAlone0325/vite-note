# Pinia 源码实现

> Pinia 的源码很简单，其实核心文件并没有几个。核心方法也就只有 `createPinia` 、 `defineStore` 、 `storeToRefs`

首先 创建 `index.js` 文件，用来导出全局的方法。先实现第一个方法：

## createPinia

> 源码文件路径： `packages/createPinia`

先看下使用：

```js
const app = createApp(App)
const pinia = createPinia()
app.use(pinia).mount('#app')
```

使用 `app.use()` 的方式来注册 `pinia` 插件，所以我们知道 `createPinia` 肯定包含一个 `install` 方法

```js
export const piniaSymbol = Symbol('pinia')

export function createPinia() {
  const scope = effectScope(true)
  const state = scope.run((() => ref({})))

  const pinia = markRaw({
    install(app) {
      // 注入 pinia 实例
      app.provide(piniaSymbol, pinia)
      app.config.globalProperties.$pinia = pinia
    },
    // 注册 pinia 插件
    use(plugin) { },

    _e: scope,
    _s: new Map(),
    state
  })
  // devTools
  // pinia.use(devtoolsPlugin)

  // 返回 pinia 实例
  return pinia
}
```

思考一：为什么使用 `const state = scope.run((() => ref({})))`？为什么编写时传入的 `state` 是一个函数？

初始化时我们携带了 `state`，是一个 `ref({})`，并且我们使用了 `scope` 作用域，这样保证了每一个组件调用的时候都是独立的，并且多次调用使用函数返回实例，也避免了数据污染。类似 `Vue2` 中 `data` 必须为函数的原因。`ref` 页保证了 `state` 的响应式。

## defineStore

> 源码文件路径： `packages/store`

`defineStore` 函数用来声明每一个 `store` ，其实可接收的参数如下：

1. `defineStore({ id: '', state: () => ({}), getters: {}, actions: {} })`
2. `defineStore('', { state: () => ({}), getters: {}, actions: {} })`
3. `defineStore(’‘, () => {// setup 函数})`

上面有三种参数方式，那么我们如何做处理，首先想到的肯定是先把参数进行规范，处理成一种格式，这样，我们就不需要对每一种方式都进行判断

```js
import { piniaSymbol } from '.'

export function defineStore(idOrOptions, setup, setupOptions) {
  let id, options

  // 将传入的参数进行规范化处理 {id, state, getters, actions}
  const isSetupStore = typeof setup === 'function'
  if (typeof idOrOptions === 'string') {
    id = idOrOptions
    options = isSetupStore ? setupOptions : setup
  } else {
    options = idOrOptions
    id = idOrOptions.id
  }

  function useStore(pinia) {
    const currentInstance = getCurrentInstance()
    pinia = currentInstance && inject(piniaSymbol)

    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        // setup 方式
        createSetupStore(id, setup, options, pinia)
      } else {
        // options 方式
        createOptionsStore(id, options, pinia)
      }
    }

    const store = pinia._s.get(id)

    return store
  }

  useStore.$id = id

  return useStore
}
```

我们可以看到首先将传入的参数进行规范处理，提取成 `id` 和 `options: {}` 的形式。接着，获取 `pinia` 的实例，然后分别处理 `setup` 、 `options` 两种传参的形式，并返回处理后的数据 `store`，然后返回 处理数据函数 `useStore`。思考，如下：

```js
// stores
const useUserStore = defineStore('id', {})

// 组件调用
const userStore = useUserStore()
```

上面代码中的 `useUserStore` 对应源码中 `useStore` 函数，`useUserStore()` 调用的返回值 `userStore` 对应 `useStore()` 调用返回的 `store`。

进行到这里，我们就需要查看具体处理两种不同参数的方法：`createSetupStore` 、 `createOptionsStore`

### createOptionsStore

我们先来看一下 `createOptionsStore` 的实现方式，这个比较简单。实现之前，我们先简单思考，在调用这个函数之前，我们获取到了 `id` 和 `options: {state: () => ({}), getters: {}, actions: {}}`；调用之后，我们最终要返回一个 `store`：

1. 带有 `ref` 或 `reactive` 响应式的 `state` 数据
2. `getters` 会处理成 `computed` 的计算属性
3. `acitons` 会处理成 `methods` 方法以供调用

```js
function createOptionsStore(id, options, pinia) {
  const { state, actions, getters } = options

  // 处理后要返回的数据
  let store

  function setup() {
    // 因为 pinia.state 是一个 ref ，所以返回的数据是 reactive({})
    pinia.state.value[id] = state ? state() : {}

    // state  reactive({}) 转为=> ref 数据
    const localState = toRefs(pinia.state.value[id])

    return Object.assign(
      // state
      localState,
      // acitons 即为 methods
      actions,
      // getters 转成 computed
      Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = markRaw(
          computed(() => {
            const store = pinia._s.get(id)
            return getters[name].call(store, store)
          })
        )
        return computedGetters
      }, {})
    )
  }

  store = createSetupStore(id, setup, options, pinia, true)

  return store
}
```

我们提取了 `options`，创建了 `setup` 函数，我们发现 `setup` 函数就是我们在 `Vue` 组件中写的 `setup` 函数，也是 `defineStore` 的 `setup` 传参方式，因此我们需要把 `setup` 函数传入 `createSetupStore` 中进行处理。

其实这时我们查看调用 `setup()` 返回的值，已经是我们想要的结果了，但为什么还需要传入 `createSetupStore` 进行第二次处理？

1. `actions` 中可以传入 **异步函数**，我们还没有处理
2. `pinia` 文档中有 `$patch`、`$reset`、`$dispose` 等方法还没有创建

### createSetupStore

```js
// 判断是否是 ref 并且存在 effect 即为 计算属性
function isComputed(o) {
  return !!(isRef(o) && o.effect)
}

function createSetupStore($id, setup, options, pinia, isOptionsStore) {
  function $patch() { }
  const $reset = () => { }
  function $dispose() { }

  // 处理 actions
  function wrapAction(name, action) {
    return function() {
      const args = Array.from(arguments)

      // ... 订阅

      let ret
      try {
        ret = action.apply(this && this.$id === $id ? this : store, args)
      } catch (error) {
        throw error
      }

      // 处理异步
      if (ret instanceof Promise) {
        return ret
          .then(value => value)
          .catch(err => Promise.reject(err))
      }
      return ret
    }
  }

  const partialStore = {
    _p: pinia,
    $id,
    $patch,
    $reset,
    $dispose
  }

  const store = reactive(Object.assign({}, partialStore))

  pinia._s.set($id, store)

  // 相当于处理后的setup return 中的数据
  const setupStore = setup()

  for (const key in setupStore) {
    const prop = setupStore[key]

    // ref 或 reactive 的数据
    if ((isRef(prop) && !isComputed(prop)) || isReactive(prop)) {
      if (!isOptionsStore) {
        // xx = ref('')/reactive({})
        pinia.state.value[$id][key] = prop
      }
    } else if (typeof prop === 'function') {
      const actionValue = wrapAction(key, prop)
      setupStore[key] = actionValue
    }
  }

  Object.assign(store, setupStore)
  // 为了 storeToRefs
  Object.assign(toRaw(store), setupStore)

  return store
}
```

## storeToRefs

`storeToRefs` 的作用是能够使解构的数据保持响应，所以我们需要把是 `ref` 和 `reactive` 的数据经过 `toRef()` 转成 `ref` 的响应式数据

```js
export function storeToRefs(store) {
  store = toRaw(store)

  const refs = {}

  for(const key in store) {
    const value = store(key)
    // 将 ref 和 reactive 的数据转成 ref 数据
    if (isRef(value) || isReactive(value)) {
      refs[key] = toRef(store, key)
    }
  }

  return refs
}
```

## 剩余

1. 热更新
2. mapXxx 辅助函数
3. use 插件
4. 发布订阅
5. 其中包含的 $xx 函数
