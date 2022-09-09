[[toc]]

## 数据类型 DataType

> Js：`null` `undefined` `string` `number` `boolean` `bigint` `Symbol` `Object` (`Array`、`Function`、`Date` ...)

> Ts：`以上所有` `void` `nerver` `enum` `unknow` `any` `自定义类型 interface、type` 

## 用 类型签名 和 Record 描述对象

```ts
type A = {
  [k: string]: number
}

const s = Symbol()
const a: A = {
  [s]: 1
}

type A2 = Record<string, number>
```

::: danger
索引签名 类型 必须是 `string` `number` `Symbol`
:::

## 用 [] 和 Array 泛型 描述 数组

```ts
type A1 = string[]
type A2 = Array<string>

type A3 = number[]
type A4 = Array<number>

type D = [string, string, number] // 三元组
const d = ['1', '2', 3]

type E = [string[], number[]]
const e = [['xx', 'xxx'], [1, 2]]
```

::: tip
由于 Array 太不精确，所以一般使用 `Array<?>` 或者 `string[]` `[string, number]` 来描述数组
:::

## 描述 函数对象

```ts
type FnA = (a: number, b: number) => number
type FnB = (a: string, b: string) => string

type FnVoid = (s: string) => void
type FnUndefined = (s: string) => undefined
```

::: tip
由于 Function 太不精确，所以一般使用 `() => ?` 来描述函数
:::

## 描述其他对象（一般用 class 对象）

```ts
const d: Date = new Date()
const r: RegExp = /ab+c/
const r2: RegExp = new RegExp('ab+c')
const m: Map<string, number> = new Map()

m.set('xx', 1)

const wm: WeakMap<{name: string}, number> = new WeakMap()

const s: Set<number> = new Set()
const ws: WeakSet<string[]> = new WeakSet()
```
