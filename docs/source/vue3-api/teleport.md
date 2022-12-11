# `./components/Teleport`

## Teleport

作用：它可以将一个组件内部的一部分模板“传送”到该组件的 DOM 结构外层的位置去

```ts
export const TeleportImpl = {
  __isTeleport: true,
  process(),

  remove(),

  move: moveTeleport
}

function moveTeleport() {}

export const Teleport = TeleportImpl as any as {
  __isTeleport: true
  new (): { $props: VNodeProps & TeleportProps }
}
```
