# `@vue/reactivity`

> core: `reactive` `ref` `readonly`

> utilities: `unref` `proxyRefs` `isRef` `toRef` `toRefs` `isProxy` `isReactive` `isReadonly` `isShallow`

> advanced: `customRef` `triggerRef` `shallowRef` `shallowReactive` `shallowReadonly` `markRaw` `toRaw`

> effect: `effect` `stop` `ReactiveEffect`

> effect scope: `effectScope` `EffectScope` `getCurrentScope` `onScopeDispose`

## reactive

通过使用 `new Proxy()` 拦截了 `get` `set` `deleteProperty` `has` `ownKeys` 等方法，并在其中响应的收集和触发响应式数据，返回代理对象

```js
const get = createGetter()
const set = createSetter()

function createGetter() {
  return function get(target, key, receiver) {
    // 触发收集依赖
    track(target, 'get', key)
    const res = Reflect.get(target, key, receiver)
    return res
  }
}
function createSetter() {
  return function set(target, key, value, receiver) {
    let oldValue = target[key]

    const res = Reflect.set(target, key, value, receiver)
    // 没有key，add 类型
    if (!hadKey) {
      trigger(target, 'add', key, value)
    } else if (hasChanged(value, oldValue)) {
      // 有 key，并且数值改变，set 类型
      trigger(target, 'set', key, value, oldValue)
    }
    return res
  }
}

function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key)
  const oldValue = target[key]
  const result = Reflect.deleteProperty(target, key)
  if (result && hadKey) {
    tirgger(target, 'delete', key, undefined, oldValue)
  }
  return result
}
function has(target, key) {
  const result = Reflect.has(target, key)
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, 'has', key)
  }
  return result
}
function ownKeys(target) {
  track(target, 'iterate', isArray(target) ? 'length' : ITERATE_KEY)
  return Reflect.ownKeys(target)
}

const mutableHandlers = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys
}

function reactive(target) {
  const proxy = new Proxy(target, mutableHandlers)
  return proxy
}
```

## ref

## readonly

通过拦截 `get` 函数，直接返回 `target`，拦截 `set` `deleteProperty` 函数，直接返回 `true` 

## unref

判断参数是否是 `ref`，是返回 `.value`，不是直接返回 

```ts
function unref<T>(ref: T | Ref<T>): T {
  return isRef(ref) ? (ref.value as any) : ref
}
```

## proxyRefs

作用：在模版中可以不使用 `.value` 的形式，直接交给程序识别

判断只有不是 `reactive` 且是 `ref` 类型数据进行处理，使用 `new proxy()` 拦截 `get`，通过 `unref` 进行脱 `.value`；拦截 `set`，进行响应式数据的赋值操作

```ts
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key]
    if(isRef(oldValue) && !isRef(value)) {
      oldValue.value = value
      return true
    } else {
      return Reflect.set(target, key, value, receiver)
    }
  }
}

function proxyRefs<T extends object>(objectWithRefs: T): ShallowUnwrapRef<T> {
  return isReactive(objectWithRefs) 
   ? objectWithRefs
   : new Proxy(objectWithRefs, shallowUnwrapHandlers)
}
```

## isRef

作用：判断数据是否是 `ref` 类型的数据

判断 `ref` 类型数据的 `__v_isRef` 属性是否为 `true`

```ts
function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
function isRef(r: any): r us Ref {
  return !!(r && r.__v_isRef === true)
}
```

## toRef

作用：基于响应式对象上的一个属性，创建一个对应的 ref

```ts
class ObjectRefImpl<T extends object, K extends keyof T> {
  public readonly __v_isRef = true

  constructor(
    private readonly _object: T,
    private readonly _key: K,
    private readonly _defaultValue?: T[K]
  ) {}

  get value() {
    const val = this._object[this._key]
    return val === undefined ? (this._defaultValue as T[K]) : val
  }

  set value(newVal) {
    this._object[this._key] = newVal
  }
}

function toRef(object, key, defaultValue) {
  const val = object[key]
  return isRef(val) ? val : new ObjectRefImpl(object, key, defaultValue)
}
```

## toRefs

作用：将一个响应式对象转换为一个普通对象，这个普通对象的每个属性都是指向源对象相应属性的 ref。每个单独的 ref 都是使用 toRef() 创建的。

```ts
export type ToRefs<T = any> = {
  [K in keyof T]: ToRef<T[K]>
}
export function toRefs<T extends object>(object: T): ToRefs<T> {
  const ret: any = isArray(object) ? new Array(object.length) : {}
  for (const key in object) {
    ret[key] = toRef(object, key)
  }
  return ret
}
```

## isProxy

作用：检查一个对象是否是由 `reactive()`、`readonly()`、`shallowReactive()` 或 `shallowReadonly()` 创建的代理。

```ts
export function isProxy(value: unknown): boolean {
  return isReactive(value) || isReadonly(value)
}
```

## isReactive

作用：检查一个对象是否是由 `reactive()` 或 `shallowReactive()` 创建的代理。

```ts
export function isReactive(value: unknown): boolean {
  if (isReadonly(value)) {
    return isReactive((value as Target)[ReactiveFlags.RAW])
  }
  return !!(value && (value as Target)[ReactiveFlags.IS_REACTIVE])
}
```
