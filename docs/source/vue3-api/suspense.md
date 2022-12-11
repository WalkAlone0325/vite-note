# `./components/Suspense`

## suspense

作用：用来在组件树中协调对异步依赖的处理。它让我们可以在组件树上层等待下层的多个嵌套异步依赖项解析完成，并可以在等待时渲染一个加载状态。

```ts
export const SuspenseImpl = {
  name: 'Suspense',
  __isSuspense: true,
  process(),
  create: createSuspenseBoundary,
  normalize: normalizeSuspenseChildren
}

export const Suspense = (__FEATURE_SUSPENSE__ ? SuspenseImpl : null) as any as {
  __isSuspense: true
  new (): { $props: VNodeProps & SuspenseProps }
}
```
