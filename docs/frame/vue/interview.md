> 面试相关

## 1. 为什么使用 虚拟DOM

::: tip
1. 创建真实 DOM 的代码高：真实 DOM 节点 node 的属性很多，而是用 vnode 仅实现一些必要的属性
2. 触发多次浏览器的重绘和回流：使用 vnode，相当于加了一个缓存，让一次数据变动先在 `vnode` 进行修改，然后diff之后对所有产生差异的节点集中一次对 `DOM tree` 进行修改，可以减少浏览器的 重绘 和 回流
3. 虚拟DOM本质是一个js对象，具备跨平台的能力，可以实现不同平台的准确显示
4. vnode 不仅在性能上有很好的收益，也使得 Vue 具备了现代框架应有的高级特性
:::

## 2. Vue 组件通信

::: tip
1. 父向子组件传值

    - 父组件发送的形式以属性的形式绑定到子组件上
    - 然后子组件使用 `props` 接收
    - 在 `props` 中使用驼峰形式，在模版中可以使用短横线形式

2. 子向父组件传值

    - 子组件使用 `$emit()` 触发事件
    - `$emit()` 第一个参数为 `自定义事件名称`，后续参数为所传递的 数据
    - 父组件使用 `v-on` 缩写为 `@` 监听子组件的事件

3. 兄弟之间的传值

    - `provide inject`
    - `vuex pinia`
    - `eventBus`
:::

## 3. Vue 中 key 的作用，为什么不推荐使用 index 作为 key

::: tip
1. key 的作用主要是为了高效的更新虚拟 DOM（直接会根据key 的变化重新排列元素的属性，并移除 key 不存在的元素）
2. 当以数组的下标index作为key时，其中一个元素（增删改查）发生了变化可能会导致所有元素的 key 值发生变化
:::

## 4. `v-show` 和 `v-if` 的区别

::: tip 
- `v-show` 原理是修改元素的 css 属性 `display: none` 来决定是否显示元素

- `v-if` 是用通过 三元表达式 直接判断和操作 DOM 来切换显示
:::

## 5. Vue 导航守卫的钩子函数有哪些

::: tip
全局守卫
1. `router.beforeEach` 全局前置守卫，进入路由前
2. `router.beforeResolve` 全局解析守卫，在 `beforeRouteEnter` 调用之后调用
3. `router.afterEach` 全局后置钩子，进入路由之后

路由组件内的守卫
1. `beforeRouteEnter()` 进入路由前
2. `beforeRouteUpdate()` 路由复用同一个组件时
3. `beforeRouteLeave()` 离开当前路由时
:::

## 6. Vue 编程式导航跳转传参的方式有哪些

::: tip
```js
// 命名的路由
router.push({ name: 'user', params: { userId: 'xx' } })

// 带查询参数，变成 /register?plan=xxx
router.push({ path: 'register', query: { plan: 'xx' } })
```
:::

