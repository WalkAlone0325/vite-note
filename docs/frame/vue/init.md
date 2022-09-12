# 创建一个 Vue3 的项目模版

[https://github.com/WalkAlone0325/v3-init-project](https://github.com/WalkAlone0325/v3-init-project)

```bash
git clone git@github.com:WalkAlone0325/v3-init-project.git
```

> 不知道小伙伴们最近发现了没有，使用 `vite` 创建 `vue3` 项目时多出了两个模版

## 创建项目
a
这里推荐是用 `pnpm`

`pnpm create vite`，直接选择 `vue`，然后选择第三个模版，如下：

![init project](/init.png)

## 添加所需要的依赖项

这里我除了 `Cypress` 都选择了 `Yes`，可以根据自己的需要按需导入

![add packages](/create.png)

<br/>

根据提示进入目录，并安装相应依赖，这里我添加几个常用的依赖项：

1. `unplugin-auto-import`: 自动导入 `vue`、`router`、`pinia` 相关 `Api` 
2. `unplugin-vue-components`: 自动导入 `vue` 组件
3. `unplugin-vue-define-options`: 支持 `name` 等属性

```sh
pnpm add unplugin-auto-import unplugin-vue-components unplugin-vue-define-options -D
```

可能还需要一些其它的包，比如 `less/sass`、`unocss` 等等，可以根据需要自行添加

## 配置项目

### 配置 `vite.config.ts`:

```ts
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { XxxResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue({
      // 开启响应式语法糖
      // ! 在 env.d.ts 中加入 /// <reference types="vue/macros-global" />
      reactivityTransform: true
    }),
    vueJsx(),
    AutoImport({
      // 自动导入相关 Api
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [XxxResolver()]
    }),
    // 自动导入 src/components 下的所有组件，并自动解析 UI 库的组件，提供 TS 类型提示
    Components({
      dirs: ['src/components'],
      resolvers: [XxxResolver()]
    })
  ]
})
```

### 配置其它文件


#### `env.d.ts`:

```ts
/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />
```

#### 添加 `.npmrc`（使用 pnpm 请看）:

> **注意点:**
> 使用 `pnpm` 需要再根目录创建 `.npmrc` 文件，并写入如下：
> ```json
> shamefully-hoist=true  # or public-hoist-pattern[]=@vue*
> ```
> 注意需要重新 `pnpm install`
> 为了 `unplugin-vue-components` 检索 `node_modules`，识别自动导入的组件
> 其它信息请查看：[pnpm 官网](https://www.pnpm.cn/npmrc)



#### 配置 `eslint` 和 `prettier`

`.prettierrc.json`: 

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "none"
}
```

`.eslintrc.cjs`: 

```js
// 添加
rules: {
  'prettier/prettier': 'error'
}
```

#### `.gitignore`

将自动生成的文件放入 `git` 忽略名单中

```
# create
auto-imports.d.ts
components.d.ts
```

## 完善项目结构和代码模版

### 改造 `stores`

```ts
// src/stores/index.ts

import type { App } from 'vue'

// 导出模块下的 store
// 可以使用 import.meta.glob
export { useCounterStore } from './modules/counter'
// import { useCounterStore } from './modules/counter'
// export { useCounterStore }

const store = createPinia()

export function setupStore(app: App<Element>) {
  app.use(store)
}
```

### 改造 `router`

`src/router/index.ts`
```ts
// src/router/index.ts

import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export function setupRouter(app: App<Element>) {
  app.use(router)
}

export function setupRouterGuard() {
  router.beforeEach((to, from, next) => {
    console.log('router guard')
    next()
  })
}
```

`src/router/routes`
```ts
import type { RouteRecordRaw } from 'vue-router'
import appRoutes from './modules'
import PageLayout from '@/layout/PageLayout.vue'

const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login-view.vue')
  },
  {
    path: '/',
    name: 'root',
    component: PageLayout,
    children: appRoutes
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/not-found.vue')
  }
]

export default constantRoutes
```

### 改造 `main.ts`

```ts
import App from './App.vue'
import { setupStore } from '@/stores'
import { setupRouter, setupRouterGuard } from '@/router'

import '@/assets/style/main.css'

function bootstrap() {
  const app = createApp(App)

  // stores
  setupStore(app)

  // router
  setupRouter(app)

  // router guard
  setupRouterGuard()

  // mount
  app.mount('#app')
}

bootstrap()
```

### 改造路由页面结构

`App.vue`

```vue
<template>
  <RouterView />
</template>
```

`PageLayout.vue`: （将容器布局放入此文件）

```vue
<script setup lang="ts">
const msg = $ref('V3-init-project')

onMounted(() => {
  console.log(msg)
})
</script>
  
<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/image/logo.jpg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld :msg="msg" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/tsx">Tsx</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
  
<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
  border-radius: 50%;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
  
```

### 测试 `pinia` 、 `tsx` 、 `响应式语法糖`

具体查看响应文件