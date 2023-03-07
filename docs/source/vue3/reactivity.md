# mountComponent => setupRenderEffect => new ReactiveEffect

## setupRenderEffect （注册 setup 渲染副作用函数）

```js
const setupRenderEffect = (instance, initialVNode, container) => {
  // 组件更新函数
  const componentUpdateFn = () => {
    // 组件未挂载
    if(!instance.isMounted) {}
    // 组件挂载，执行更新 update
    else {}
  }

  const effect = instance.effect = new ReactiveEffect(
    componentUpdateFn, 
    () => queueJob(update), 
    instance.scope
  )

  const update = instance.update = () => effect.run()
  update.id = instance.uid

  update()
}
```

- 创建组件更新函数 componentUpdateFn
- 创建响应式副作用实例 `const effect = instance.effect = new ReactiveEffect()`
- 启动更新函数 update，执行副作用 run

### componentUpdateFn

- 挂载阶段
  - 挂载前 beforeMount
  - render 计时开始
  - 执行渲染 `const subTree = instance.subTree = renderComponentRoot(instance)`
  - render 计时结束
  - patch 计时开始
  - 执行 patch
  - patch 计时结束
  - `initialVNode.el = subTree.el`
  - 挂载完成 mounted
- 更新阶段
  - 更新前 beforeUpdate
  - render 计时开始
  - 执行渲染 `const nextTree = renderComponentRoot(instance)`
  - render 计时结束
  - patch 计时开始
  - 执行 patch
  - patch 计时结束
  - `next.el = nextTree.el`
  - updated 更新结束钩子

#### renderComponentRoot (runtime-core/componentRenderUtils)

```js
export function renderComponentRoot(instance) {
  // packages/runtime-core/src/vnode.ts
  normalizeVNode()
}
```

### ReactiveEffect (packages/reactivity/src/effect.ts)


