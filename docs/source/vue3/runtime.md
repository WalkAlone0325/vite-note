## createApp 过程

```ts
const app = ensureRenderer().createApp(...args)
```

### ensureRenderer (runtime-dom/index)

```ts
return renderer = createRenderer(rendererOptions)
```

### createRenderer (runtime-dom/renderer) 创建渲染器

```ts
export function createRenderer(options) {
  return baseCreateRenderer(options)
}
```

```ts
function baseCreateRenderer() {
  const patch = () => {}

  // 挂载组件
  const mountComponent = () => {}

  // 注册 setup 渲染副作用函数
  const setupRenderEffect = () => {}

  // render 函数
  const render = (vnode, container) => {
    if(vnode == null) {
      // unmount
      unmount()
    } else {
      // patch 上面的
      patch(container._vnode || null, vnode, container)
    }

    flushPreFlushCbs()
    flushPostFlushCbs()

    // 更新容器 _vnode
    container._vnode = vnode
  }

  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  }
}
```

#### createAppAPI (runtime-core/apiCreateApp)

```ts
return function createApp(rootComponnet, rootProps = null) {
  if(!isFunction(rootComponent)) { rootComponent = { ...rootComponent } }

  if(rootProps != null && !isObject(rootProps)) { rootProps = null }

  // 创建上下文
  const context = createAppContext()
  // 插件
  const installedPlugins = new Set()

  let isMounted = false

  const app = {
    version,
    get config() {
      return context.config
    },
    set config() {},
    use() {},
    mixin() {},
    component() {},
    directive() {},
    mount() {},
    unmount() {},
    provide() {},
  }

  return app
}
```

- 传入根组件 `rootComponent`，既调用 `createApp` 传入的 `App` 组件 `const app = createApp(App)`
- 判断传入的 `rootComponent` 是否是函数，不是则展开
- 判断传入的 `rootProps` 进行验证是否是 obj
- 创建上下文 `const context = createAppContext()`
- 安装插件存放 `const installedPlugins = new Set()`
- 创建 app 实例，包括 `config` `use` `version` `mixin` `component` `directive` `mount` `unmount` `provide` 等

- config ：返回上下文的配置
  
  ```js
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: undefined,
      warnHandler: undefined,
      compilerOptions: {}
    },
  ```

- use ：`new Set()` 数据结构类型，如果存在报警告；如果存在 install 方法，且是函数，添加插件，调用install 方法；如果插件是函数，直接执行
- mixin ：数组结构，判断是否 includes，直接 push
- component ：`context.components[name] = component`
- directive ：`context.directives[name] = directive`
- mount ：`createVNode()` 函数返回 vnode；`render(vnode, rootContainer)` 进行渲染；isMounted 设为 true；`app._container = rootContainer` 将根容器缓存；安装 devtool
- unmount ：`render(null, app._container)`；卸载 devtool
- provide ：`context.provides[key] = value`

#### render (runtime-dom/renderer) => patch()

内部首次执行 `patch` 函数

```js
const patch = (
  n1, // 旧
  n2, // 新
  container // 容器
) => {}
```

- n1 n2 一样，直接返回
- n1 n2 不是相同的类型，直接卸载旧的树 n1
- 判断 n2 的 type 类型，通过 `switch case` 逐步执行。`Text` `Comment` `Static` `Fragment`; `ELEMENT` `COMPONENT` `TELEPORT` `SUSPENSE`；设置 ref 属性 `setRef(ref, n1 && n1.ref, ...)`


- processText
- processCommentNode
- mountStaticNode  patchStaticNode
- processFragment
- processElement
- processComponent
- type.process  (TELEPORT | SUSPENSE)
- setRef

## patch(n1, n2, container)

### processComponent(n1, n2, container) 组件

- 判断 如果 `n1 == null`，挂载过程。如果存在 keepalive，调用 parentComponent.ctx.activate 将组件设置为活跃状态；否则执行 挂载组件 `mountComponent`
- n1 不为 null，执行 组件更新 `updateComponent`

#### mountComponent(initialVNode, container)  ()

- 创建组件实例 instance
- 注册 HMR 热更新
- 异常上下文注册，开始计时 mount `startMeause(instance, 'mount')`
- 判断 isKeepAlive
- 开始计时 init `startMeause(instance, 'init')`，创建组件 `setupComponent(instance)`，结束计时 init `endMeause(instance, 'init')`
- `setupRenderEffect()` 注册渲染副作用函数
- 移除异常上下文 `popWarningContext()`；结束计时 mount `endMeause(instance, 'mount')`

##### setupComponent(instance)

```js
export function setupComponent(instance) {
  const { props, children } = instance.vnode
  const isStateful = isStatefulComponent(instance)

  // 初始化 props slots
  initProps(instance, props) // 内部使用 shallowReactive 进行浅响应
  initSlots(instance, children)

  const setupResult = isStateful ? setupStatefulComponent(instance) : undefined

  return setupResult
}
```

- 从组件实例上解构 props children
- 判断是否为状态组件
- 获取到组件状态 setup 函数的返回结果

##### setupStatefulComponent

```js
function setupStatefulComponent(instance) {
  const Component = instance.type
  instance.accessCache = Object.create(null)

  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers))
}
```

##### handleSetupResult

```js
function handleSetupResult(instance, setupResult) {
  if(isFunction(setupResult)) {
    instance.render = setupResult
  }
  else if(isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult)
  }

  finishComponentSetup(instance)
}
```

- 如果 setupResult 是函数，即为 render 函数，`instance.render = setupResult`
- 如果是 Obj，则为响应式状态数据和方法等，经过 `proxyRefs` 处理，然后赋值给 组件实例的 setupState `instance.setupState = proxyRefs(setupResult)`
- 调用 `finishComponentSetup(instance)`

##### finishComponentSetup  编译器注入 compile

```js
function finishComponentSetup(instance) {
  const Component = instance.type

  if(!instance.render) {
    // 编译器存在
    if(compile && !Component.render) {
      // 模版
      const template = Component.template

      if(template) {
        // compile 编译器 传入模版，编译器配置项
        Component.render = compile(template, finalCompilerOptions)
      }
    }
  }

  instance.render = Component.render || () => {}
}
```

- 获取模版 template，如果模版存在则进行编译，编译计时开始
- 配置编译器配置项 `finalCompilerOptions`，使用编译器 `compile` 进行编译
- 赋值给 `Component.render`
- 编译计时结束
- 然后赋值给组件实例的render `instance.render`

##### registerRuntimeCompiler 注册编译器 (runtime-core/component)

```js
let compile
export function registerRuntimeCompiler(_compile) {
  compile = _compile
}
```

使用此函数注入编译器，在 `packages/vue/src/index.ts`
