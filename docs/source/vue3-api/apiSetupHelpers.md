# `apiSetupHelpers`

1. `useAttrs`
2. `useSlots`

## useAttrs

作用：在 `<script setup>` 使用 `slots` 和 `attrs` 的情况应该是相对来说较为罕见的，因为可以在模板中直接通过 `$slots` 和 `$attrs` 来访问它们。在你的确需要使用它们的罕见场景中，可以分别用 `useSlots` 和 `useAttrs` 两个辅助函数

`useSlots` 和 `useAttrs` 是真实的运行时函数，它的返回与 `setupContext.slots` 和 `setupContext.attrs` 等价。它们同样也能在普通的组合式 API 中使用。

```ts
function createAttrsProxy(instance: ComponentInternalInstance): Data {
  return new Proxy(instance.attrs, {
    get(target, key: string) {
      track(instance, 'get', '$attrs')
      return target[key]
    }
  })
}

function createSetupContext(instance: ComponentInternalInstance): SetupContext {
  const expose: SetupContext['expose'] = exposed => {
    instance.exposed = exposed || {}
  }

  let attrs: Data

  return {
    get attrs() {
      return attrs || (attrs = createAttrsProxy(instance))
    },
    slots: instance.slots,
    emit: instance.emit,
    expose
  }
}

function getContext(): SetupContext {
  const i = getCurrentInstance()!
  return i.setupContext || (i.setupContext = createSetupContext(i))
}

export function useAttrs(): SetupContext['attrs'] {
  return getContext().attrs
}
```

## useSlots

```ts
export function useSlots: SetupContext['slots'] {
  return getContext().slots
}
```
