# `./scheduler` `./apiDefineComponent` `./apiAsyncComponent`

1. `nextTick`
2. `defineComponent`
3. `defineAsyncComponent`

## nextTick

作用：等待下一次 DOM 更新刷新的工具方法。

当你在 Vue 中更改响应式状态时，最终的 DOM 更新并不是同步生效的，而是由 Vue 将它们缓存在一个队列中，直到下一个“tick”才一起执行。这样是为了确保每个组件无论发生多少状态改变，都仅执行一次更新。

nextTick() 可以在状态改变后立即使用，以等待 DOM 更新完成。你可以传递一个回调函数作为参数，或者 await 返回的 Promise。

```ts
export function nextTick<T = void>(
  this: T
  fn?: (this: T) => void
): Promise<void> {
  const p = Promise.resolve()
  return fn ? p.then(this ? fn.bind(this) : fn) : p
}
```

## defineComponent

作用：在定义 Vue 组件时提供类型推导的辅助函数。

```ts
export const isFunction = (val: unknown): val is Function => typeof val === 'function'

export function defineComponent(options: unknown) {
  return isFunction(options) ? { setup: options, name: options.name } : options
}
```

## defineAsyncComponent

作用：定义一个异步组件，它在运行时是懒加载的。参数可以是一个异步加载函数，或是对加载行为进行更具体定制的一个选项对象。

`packages/runtime-core/src/apiAsyncComponent.ts`
