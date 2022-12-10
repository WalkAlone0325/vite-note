# `./apiInject`

1. `provide`
2. `inject`

## provide

作用：提供一个值，可以被后代组件注入。

解析：现在找到当前组件实例的注入值 `provides`，再找到父组件的 `provides`，判断如果相等，则父组件的注入值即当前组件的值

```ts
export interface InjectionKey<T> extends Symbol {}

export function provide<T>(key: InjectionKey<T> | string | number, value: T) {
  if(currentInstance) {
    let provides = currentInstance.provides

    const parentProvides = currentInstance.parent && currentInstance.parent.provides
    if(parentProvides == provides) {
      provides = currentInstance.provides = Object.create(parentProvides)
    }
    provides[key as string] = value
  }
}
```

## inject

作用：注入一个由祖先组件或整个应用 (通过 `app.provide()`) 提供的值。

```ts
export function inject(
  key: InjectionKey<any> | string,
  defaultValue?: unknown,
  treatDefaultAsFactory = false
) {
  const instance = currentInstance || currentRenderingInstance
  const provides =
      instance.parent == null
        ? instance.vnode.appContext && instance.vnode.appContext.provides
        : instance.parent.provides

  if (provides && (key as string | symbol) in provides) {
      return provides[key as string]
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue)
        ? defaultValue.call(instance.proxy)
        : defaultValue
    }
}
```
