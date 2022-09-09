[[toc]]

## 数据类型 DataType

> Js：`null` `undefined` `string` `number` `boolean` `bigint` `Symbol` `Object` (`Array`、`Function`、`Date` ...)

> Ts：`以上所有` `void` `never` `enum` `unknow` `any` `自定义类型 interface、type` 

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

## unknow 和 any

> unknow 定义的时候不知道的类型，使用时具体给定，可以使用 as，会自己判断类型

> any 任何类型

## never

> never 不是用来声明的，而是用来进行推断的

```ts
type A = string | number

const a: A = 'hello' as any

if(typeof a === 'string') {
  a.split('')
} else if(typeof a === 'number') {
  a.toFixed(2)
} else {
  // a 此处 a 的类型是 never
  console.log('没了')
}
```

## enum 类型

```ts
enum A = {
  todo = 0,
  done,
  archived,
  deleted
}

let status = 0
status = A.todo
```

```ts
// 权限 位运算
enum Permission {
  None = 0,                     // 0000
  Read = 1 << 0,                // 0001
  Write = 1 << 1,               // 0010
  Delete = 1 << 2,              // 0100
  Manage = Read | Write | Delete // 0111
}

type User {
  permission: Permission
}

const user: User = {
  permission: 0b0101
}

if((user.permission & Permission.Write) === Permission.Write) {
  console.log('拥有 Write 权限')
}
```

## type 和 interface

> 什么时候都可以用 type
> type：类型别名 Type Aliaes （给其它类型取个名字）

```ts
type Name = string
type FalseLike = 0 | false | null | undefined | ''
type Point = {x: number; y: number}
type Points = Point[]
type Line = [Point, Point]
type Circle = { center: Point, radius: number}
type Fn = (a: number) => number
type FnWithProps = {
  (a: number): number // 函数
  prop1: number
}
```

> 声明接口
> interface: 描述对象的属性（declare the shapes of  objects）

```ts
interface A {
  [k: string]: string
}

type A1 = Array<string> & {
  name: string
}
interface A2 extends Array<string> {
  name: string
}

// 函数
interface Fn {
  (a: number): number
}

// Date
interface D extends Date {}
```

## ** type 和 interface 的关系和区别

![type和interface](/type和interface.png)


::: tip
| interface                                       |                        type                        |
| ----------------------------------------------- | :------------------------------------------------: |
| 只描述对象                                      |                   可描述所有数据                   |
| 类型声明                                        |                    只是类型别名                    |
| 自动合并（对外 Api 尽量用 interface，方便扩展） | 不可重新赋值（对内 Api 尽量用 type，防止代码分散） |

:::

## void 类型