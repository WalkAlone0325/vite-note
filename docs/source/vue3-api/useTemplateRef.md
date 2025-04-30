# useTemplateRef

文件路径： `packages/runtime-core/src/helpers/useTemplateRef.ts`

## 文件内容

```ts
import { type ShallowRef, readonly, shallowRef } from '@vue/reactivity'
import { getCurrentInstance } from '../component'
import { warn } from '../warning'
import { EMPTY_OBJ } from '@vue/shared'

export const knownTemplateRefs: WeakSet<ShallowRef> = new WeakSet()

export type TemplateRef<T = unknown> = Readonly<ShallowRef<T | null>>

export function useTemplateRef<T = unknown, Keys extends string = string>(
  key: Keys,
): TemplateRef<T> {
  const i = getCurrentInstance()
  const r = shallowRef(null)
  if (i) {
    const refs = i.refs === EMPTY_OBJ ? (i.refs = {}) : i.refs
    let desc: PropertyDescriptor | undefined
    if (
      __DEV__ &&
      (desc = Object.getOwnPropertyDescriptor(refs, key)) &&
      !desc.configurable
    ) {
      warn(`useTemplateRef('${key}') already exists.`)
    } else {
      Object.defineProperty(refs, key, {
        enumerable: true,
        get: () => r.value,
        set: val => (r.value = val),
      })
    }
  } else if (__DEV__) {
    warn(
      `useTemplateRef() is called when there is no active component ` +
        `instance to be associated with.`,
    )
  }
  const ret = __DEV__ ? readonly(r) : r
  if (__DEV__) {
    knownTemplateRefs.add(ret)
  }
  return ret
}
```

## 文件解析

  从上面的内容可以看到，`useTemplateRef` 是一个函数，用于在 Vue3 组件中创建一个模板引用。它接受一个键值作为参数，并返回一个只读的浅引用对象。

  函数内部首先调用 `getCurrentInstance` 函数获取当前组件实例。然后，使用 `shallowRef` 函数创建一个浅引用对象 `r`，并将其初始值设置为 `null`。

  如果当前组件实例存在，函数会将 `refs` 对象添加到组件实例中。如果 `refs` 对象不存在，则会创建一个空对象。然后，使用 `Object.defineProperty` 方法将键值和对应的浅引用对象添加到 `refs` 对象中。

  `i.refs`为组件实例上所有存在的 `ref` 对象，`refs` 是一个对象，用于存储组件实例上的 `ref` 对象。`refs` 对象的键是 `ref` 的名称，值是 `ref` 的值。
