[[toc]]

## 联合类型（并集）

> `type C = A | B`

```ts
type A = {name: string}
type B = {age: number}
type C = A | B

const c: C = {
  name: 'nebula'
}
```

![并集](/bingji.png)

类型收窄

```ts
// 声明为并集，但是使用时需要区分类型的行为叫类型收窄
const f1 = (a: number | string) => {
  if(typeof a === 'number') {
    a.toFixed(2)
  } else {
    a.split(',')
  }
}
```

::: tip
类型区分
1. `typeof`
2. `instanceof`
3. `in`
4. js 中特有的一些方法，如 `Aarray.isArray()`
5. ts 类型谓词 `is`
6. ts 可辨别联合 `x.kind`
7. ts 断言 `as`
:::

## 类型谓词/类型判断 is

> is 判断任意类型的 收窄
> 1. 支持所有ts类型
> 2. 写起来麻烦

```ts
type Rect {height: number; width: number}
type Circle {center: [number, number]; radius: number}

const f1 = (a: Rect | Circle) => {
  if(isRect(a)) {
    a
  }
}

function isRect(x: Rect | Circle): x is Rect {
  return 'height' in x && 'width' in x
}
```

## 可辨别联合 x.kind

> 添加一个可辨别的同名 key 值进行类型收窄 `kind: 'Xx'`

```ts
type Rect {kind: 'Rect', height: number; width: number}
type Circle {kind: 'Circle', center: [number, number]; radius: number}
type Shape = Rect | Circle

const f1 = (a: Shape) => {
  if(a.kind === 'Circle') {
    a
  }
}
```

## 交叉类型（交集）itersection types

![交集](/jiaoji.png)


