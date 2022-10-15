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

## 7. Vue3 性能提升的几个方面

::: tip
1. 编译阶段
   1. `diff` 算法优化 （最长递增子序列）(静态标记，会发生变化的地方添加 `flag`，发生变化时直接找该地方进行比较)
   2. 静态提升（不参与更新的元素，做静态提升，只会被创建一次，在渲染时直接复用）
   3. 事件监听缓存（开启事件缓存，diff 算法时直接复用）
   4. `SSR` 优化

2. 源码体积
   1. 移除了一些不常用的 API
   2. `tree shanking`

3. 响应式系统
   1. `vue2` 使用 `defineProperty` 来劫持整个对象，然后深度遍历所有属性，给每个属性添加 `getter` 和 `setter` 来实现响应式
   2. `vue3` 使用 `proxy` 重写了响应式系统，因为 `proxy` 可以对真个对象进行监听，不需要深度遍历
      - 可以监听动态属性的添加
      - 可以监听数组的 `索引` 和数组的 `length` 属性
      - 可以监听 删除属性
:::

## 8. `Composition API` 和 `Options API` 对比

::: tip
1. 在 逻辑组织 和 逻辑复用 方面，前者优于后者
2. 前者几乎都是函数，所有 `ts` 类型推断更好的支持
3. 前者的 `tree-shanking` 更友好，代码更容易压缩
4. 前者减少了 `this` 的使用，避免了出现 `this` 指向不明的情况
5. 对于小型组件，后者更为方便
:::

## 9. Vue3 和 Vue2 对比，以及 Vue3 的新特性

::: tip
1. 速度更快
   1. 重写了 `虚拟Dom` 实现
   2. 编译模版的优化
   3. 更高效的组件初始化
   4. `undate` 性能提升 1.3~2 倍
   5. `SSR` 速度提高了 2~3 倍
2. 体积更小
   1. 对开发人员，能够对Vue实现更多的其它功能，不用担心包的体积过大
   2. 对使用者，打包出来的包体积变小了
3. 更易维护
   1. 可与 `Options API` 一起使用
   2. 灵活的逻辑组合与复用
   3. Vue3 单模块可以与其他框架搭配使用
   4. 更好的 TS 支持
4. 更接近原生
   1. 可以自定义渲染器 API
5. 更易使用
:::

::: tip
Vue3 的新特性

1. `Framents` （多根节点）
2. `Teleport` （传送门）
3. `Suspense` （异步组件）
4. `Composition API` （组合式 API）
5. `createRenderer` （自定义渲染器）
:::

## 10. diff 算法比较

::: tip
1. 简单 Diff 算法
   
   > 简单 Diff 算法的核心逻辑是，拿新的一组子节点的节点去旧的一组子节点中寻找可复用的节点。如果找到了，则记录该节点的位置索引。我们把这个位置索引称为最大索引。在整个更新过程中，如果一个节点的索引值小于最大索引，则说明该节点对应的真实DOM元素需要移动。

2. 双端 Diff 算法

   > 双端 Diff 算法指的是，在新旧两组子节点的四个端点之间分别进行比较，并试图找到可复用的节点。相比简单 Diff 算法，双端 Diff 算法的优势在于，对于同样的更新场景，执行的DOM移动操作次数更少。

3. 快速 Diff 算法

   > 快速 Diff 算法在实测中性能更优，先处理新旧两组子节点中相同的前置节点和后置节点。当前置节点和后置节点都处理完成后，如果无法简单的通过挂载节点或卸载已经不存在的节点来完成更新，则需要根据节点的索引关系，构造出一个最长递增子序列。最长递增子序列所指向的节点即为不需要移动的节点。（其中元素值 为 -1 的则为需要新增的节点）
:::

## 11. Vue3 中编译优化有哪些？

::: tip 
- **补丁标志** ： 编译优化的核心在于区分 `动态节点` 和 `静态节点`。Vue3 会为 动态节点 打上 `补丁标志 patchFlag`
- **`Block` 树** ： 提出 Block 概念，本质上也是一个虚拟节点，但是会多出一个 `dynamicChildren` 数组，会收集所有的动态节点，利用了 `createVNode` 函数 和 `createBlock` 函数的层层嵌套的特点，即以 ”由内向外“ 的方式执行。再配合一个临时存储动态节点的节点栈，即可完成动态子节点的收集
- **静态提升** ： 能够减少更新时创建虚拟 DOM 带来的性能开销和内存占用
- **预字符串化** ： 在静态提升的基础上，对静态节点进行字符串化。这样做能够减少创建虚拟节点产生的性能开销和内存占用
- **`v-once` 指令** ： 缓存全部或部分虚拟节点，能够避免组件更新时重新创建虚拟 DOM 带来的性能开销，也可以避免无用的 Diff 操作
:::

## 12. Vue 如何重新加载页面

> 利用 nextTick 在刷新后重新设置为 true 来使得页面或 局部刷新

```vue
<template>
  <!-- 局部 -->
  <div v-if="load">xx</div>
  <!-- 页面 -->
  <router-view v-if="load" />
</template>
<script>
export default {
  setup() {
    const load = ref(true)
    const reload = () => {
      load.value = false
      nextTick(() => {
        load.value = true
      })
    }
  }
}
</script>
```

## 13. Vue 常用指令及作用

1. `v-on` : 给标签绑定事件监听器，可以缩写为 `@`，有如下修饰符：
   1. `.stop` : 调用 `event.stopPropagation()`
   2. `.prevent` : 调用 `event.preventDefault()`
   3. `.capture` : 在捕获模式添加事件监听器
   4. `.self` : 只有事件从元素本身发出才触发处理函数
   5. `.{keyAlias}` : 只在某些按键下触发处理函数
   6. `.once` : 最多触发一次处理函数
   7. `.left` : 只在鼠标左键事件触发处理函数
   8. `.right` : 只在鼠标右键事件触发处理函数
   9. `.middle` : 只在鼠标中键事件触发处理函数
   10. `.passive` : 通过 `{ passive: true }` 附加一个 DOM 事件
2. `v-bind` : 对属性进行动态绑定，可以缩写为 `:`，有如下修饰符：
   1. `.camel` : 将短横线命名的 `attribute` 转变为驼峰式命名
   2. `.prop` : 强制绑定为 `DOM property`
   3. `.attr` : 强制绑定为 `DOM attribute`
3. `v-slot` : 用于声明具名插槽或是期望接收 props 的作用域插槽，可以缩写为 `#`
4. `v-for` : 循环遍历数组元素
5. `v-show` : 通过 `display` css 属性控制是否显示内容
6. `v-if` : 通过 js 三元表达式来显示和隐藏标签
7. `v-else` : 与 `v-if` 连用
8. `v-text` : 解析文本，更新元素的文本内容
9.  `v-html` : 解析 html 标签，更新元素的 `innerHTML`
10. `v-model` : 在表单输入元素或组件上创建双向绑定，适用于 `<input>` `<select>` `<textarea>` `components`， 有如下修饰符：
    1. `.lazy` : 监听 `change` 事件而不是 `input`
    2. `.number` : 将输入的合法符串转为数字
    3. `.trim` : 移除输入内容两端空格

11. `v-pre` : 跳过该元素及其所有子元素的编译
12. `v-once` : 仅渲染元素和组件一次，并跳过之后的更新
13. `v-memo` : 缓存一个模板的子树。在元素和组件上都可以使用
14. `v-cloak` : 用于隐藏尚未完成编译的 DOM 模板

## 14. Vue 中 v-for 的作用

- key 的作用主要是为了更高效的更新 虚拟 DOM，因为可以精确找到相同节点
- Vue 在 patch 中，判断两个节点是否是相同节点，key 是必要条件。如果不写 key，会导致元素频繁更新，整个 patch 过程比较低效，影响性能
- 避免使用数组下标做 key，key值不唯一可能会导致视图错误，和不会触发过渡效果等

## 15. Vue 的生命周期

1. `beforeCreate` : 在组件实例初始化完成之后立即调用
2. `created` : 在组件实例处理完所有与状态相关的选项后调用
3. `beforeMount` : 在组件被挂载之前调用
4. `mounted` : 在组件被挂载之后调用
5. `beforeUpdate` : 在组件即将因为一个响应式状态变更而更新其 DOM 树之前调用
6. `updated` : 在组件因为一个响应式状态变更而更新其 DOM 树之后调用
7. `beforeUnmount` : 在一个组件实例被卸载之前调用
8. `unmounted` : 在一个组件实例被卸载之后调用
9. `activated` : 若组件实例是 `<KeepAlive>` 缓存树的一部分，当组件被插入到 DOM 中时调用
10. `deactivated` : 若组件实例是 `<KeepAlive>` 缓存树的一部分，当组件从 DOM 中被移除时调用
11. `errorCapured` : 在捕获了后代组件传递的错误时调用

## 16. Vue 子组件和父组件执行顺序

> **组件挂载更新时都是在 `beforeMount` 之后 `mounted` 之前 进行 `patch` **

加载渲染过程：父 beforeCreate => 父 created => 父 beforeMount => 子 beforeCreate => 子 created => 子 beforeMount => 子 mounted => 父 mounted

更新过程：父组件 beforeUpdate =>子组件 beforeUpdate =>子组件 updated => 父组件 updated


