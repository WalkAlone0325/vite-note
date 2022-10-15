# 同构渲染

> - **客户端渲染CSR**：用于构建客户端应用程序，组件代码能够在浏览器中运行，并输出 DOM 元素。
> - **服务端渲染SSR**：用于在 Node.js 中运行，可以将同样的组件渲染为字符串发送给浏览器。
> - **同构渲染**：两者结合

|                |  SSR  |  CSR   | 同构渲染 |
| :------------: | :---: | :----: | :------: |
|      SEO       | 友好  | 不友好 |   友好   |
|    白屏问题    |  无   |   有   |    无    |
| 占用服务端资源 |  多   |   少   |    中    |
|    用户体验    |  差   |   好   |    好    |

## 服务端渲染

- 服务端渲染不存在数据变更后的重新渲染，所以无需 调用 `reactive` 函数对 `data` 等数据进行包装，也无需使用 `shallowReactive` 函数 对 `props` 进行包装。因此，也无需调用 `beforeUpdate` 和 `updated` 钩子
- 服务端渲染是，有语不需要渲染真实的 DOM，所以无需调用组件的 `beforeMount` 和 `mounted` 钩子

## 客户端激活

> 在同构渲染过程中，组件的代码会分别在服务端和浏览器中执行一次。在服务端，组件会被渲染为静态的 HTML 字符串，并发送给浏览器。浏览器则会渲染由服务端返回的静态的 HTML 内容，并下载打包在静态资源中的组件代码。当下载完成后，浏览器会解释并执行该组件代码。当组件代码在客户端执行时，由于页面中已经存在对应的 DOM 元素，所以渲染器并不会执行创建 DOM 元素的逻辑，而是会执行激活操作。激活操作分为两个步骤：
  - 在虚拟节点与真实 DOM 元素之间建立联系，即 `vnode.el = el`。保证后续更新程序的正确执行
  - 为 DOM 元素添加事件绑定

## 编写 同构组件代码

> **同构组件的代码既运行在服务端，也运行在客户端**

- **注意组件的生命周期**。`beforeUpdate` 、 `updated` 、 `beforeMount` 、 `mounted` 、 `beforeUnmount` 、 `unmounted` 等生命周期钩子函数不会在服务端运行
- **使用跨平台的 API**。注意代码的跨平台性。例如使用 `Axios` 作为网络请求库
- **特定端的实现**。无论在客户端还是在浏览器端，都应该保证功能的一致性。例如，组件需要读取 `cookie` 信息。在客户端，可以直接用过 `document.cookie` 来实现读取；而在服务器端，则需要根据请求头来实现读取。所以，很多功能模块需要我们为客户端和服务端分别实现
- **避免交叉引起的状态污染**。状态污染既可以是应用级的，也可以是模块级的。对于应用，我们应该为每一个请求创建一个独立的应用实例。对于模块，我们应该避免使用模块级的全局变量。这是因为在不做特殊处理的情况下，多个请求会共用模块级的全局变量，造成请求间的交叉污染
- **仅在客户端渲染组件中的部分内容**。这需要我们自行封装 `<ClientOnly>` 组件，该组件包裹的内容仅在客户端才会被渲染

### 注意组件的生命周期

```vue
<script>
export default {
  created() {
    this.timer = setInterval(() => {
      // 做一些事情
    }, 1000)
  },
  // ! 在服务器端运行，因为没有此生命周期，代码不会运行，定时器无法被清除，会造成 内存泄露
  beforeUnmount() {
    // 清除定时器
    clearInterval(this.timer)
  }
}
</script>
```

如果在客户端运行，并不会产生任何问题；但是在服务器端运行，因为没有此生命周期，代码不会运行，定时器无法被清除，会造成 内存泄露。

实际上，在 created 钩子函数中设置定时器对于服务端渲染没有任何意义。这是因为在服务端渲染的是应用程序的 **快照**。所谓快照，指的是在当前数据状态下页面应该呈现的内容。所以，在定时器到时，修改数据状态之前，应用程序的快照已经渲染完成了。所以说，在服务端渲染时，定时器的代码没有任何意义。遇到这类问题，我们有两种解决办法：
1. 将创建定时器的代码移动到 mounted 钩子中，即只在客户端执行定时器；
2. 使用环境变量包裹这段代码，让其不在服务端运行

```vue
<script>
export default {
  created() {
    // 使用环境变量区分
    if(!import.meta.env.SSR) {
      this.timer = setInterval(() => {
        // 做一些事情
      }, 1000)
    }
  },
  beforeUnmount() {
    // 清除定时器
    clearInterval(this.timer)
  }
}
</script>
```

### 使用跨平台的 API

```vue
<script>
let storage

if (!import.meta.env.SSR) {
  // 用于客户端
  storage = import('./storage')
} else {
  // 用于服务端
  storage = import('./storage-server')
}

export default {
}
</script>
```

### 避免交叉引起的状态污染

> 在服务端渲染时，我们会为每一个请求创建一个全新的应用实例，例如：（**避免不同请求共用同一个应用实例所导致状态污染**）

```js
import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import App from 'App.vue'

// 每一次请求到来，都会执行一个 render 函数
async function render(url, manifest) {
  // 为当前请求创建应用实例
  const app = createSSRApp(App)

  const ctx = {}
  const html = await renderToString(app, ctx)

  return html
}
```

> 模块的全局变量：
> 如果下面这段代码在浏览器中运行，则不会出现任何问题。因为**浏览器和用户是一对一的关系，每一个浏览器都是独立的**。但如果在服务端运行，情况会有所不同，因为**服务器与用户是一对多的关系**。当用户A发送请求到服务器时，服务器会执行下面的代码 `count++`。接着，用户B也发送请求到服务器，服务器再次执行下面的代码，此时 `count` 已经被用户A的请求自增了一次，因此对于用户B而言，用户A的请求会影响到他，于是就会造成请求间的交叉污染

```vue
<script>
// 模块级别的全局变量
let count = 0

export default {
  created() {
    count++
  }
}
</script>
```

### 仅在客户端渲染组件中的部分内容

> 日常开发中，我们经常会使用第三方模块，而它们不一定对 SSR 友好，这时我们可以使用 `<ClientOnly></ClientOnly>` 包裹，让其只在客户端渲染

```vue
<template>
  <ClientOnly>
    <SsrIncompatibleComp />
  </ClientOnly>
</template>
```

实现：利用 `onMounted` 只在客户端执行的特性

```js
import { defineComponent, ref, onMounted } from 'vue'

export const ClientOnly = defineComponent({
  setup(_, { slots }) {
    // 标记变量，仅在客户端渲染时为 true
    const show = ref(false)

    // 只有在客户端的时候才会运行，show 才是 true
    onMounted(() => {
      show.value = true
    })

    // 在服务端为 null， 在客户端才会渲染插槽内的 内容
    return () => (show.value && slots.default ? slots.default() : null)
  }
})
```
