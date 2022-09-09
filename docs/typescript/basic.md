[[toc]]

## 类型擦除

> TS 转换成 JS 的过程，编译成 Js 代码

::: tip
擦除类型的方式（前两种快（不检查 TS 语法））

1. `npm i -g esbuild` : esbuild 1.ts > 1.js
2. `npm i -g @swc/cli @swc/core` : swc 1.ts -o 1.js
3. `npm i -g typescript` : tsc 1.ts
4. `npm i @babel/core @babel/cli @babel/preset-typescript` : babel --presets @babel/preset-typescript 1.ts
:::

## TS 与 ES6、ES5 的关系

![ts常用执行](/ts1.png)

## ES6 兼容表

[http://kangax.github.io/compat-table/es6/](http://kangax.github.io/compat-table/es6/)

## 编写 TS 代码的常用工具

1. [TypeScript Playground](https://www.typescriptlang.org/play)
2. [PlayCode](https://playcode.io/)
3. [stackblitz](https://stackblitz.com/)
4. [codesandbox](https://codesandbox.io/)
5. [Vite](https://cn.vitejs.dev/)

## 本地使用 Node 运行 TS

1. [ts-node](https://typestrong.org/ts-node/)
2. [swc-node](https://github.com/swc-project/swc-node)
3. [esm-loader](https://github.com/esbuild-kit/esm-loader)
4. [***esno**](https://github.com/esbuild-kit/esno)

## 推荐的书

1. 编程与类型系统（微信读书）
2. TypeScript编程
3. 类型和程序设计语言