# 大屏适配方案

1. zoom 方案（Chrome浏览器） 
2. * **scale 缩放**
3. rem 布局

举例：

1. [https://github.com/pasBone/vue-fit-next](https://github.com/pasBone/vue-fit-next)
2. [https://github.com/Alfred-Skyblue/v-scale-screen](https://github.com/Alfred-Skyblue/v-scale-screen)
3. [https://juejin.cn/post/7147897102398390308](https://juejin.cn/post/7147897102398390308?)
4. [https://gitee.com/dromara/go-view](https://gitee.com/dromara/go-view)

## zoom

```js
const percentage, appHeight = 768 // 设置默认屏幕大小
percentage = window.innerHeight * 100 / appHeight
percentage = Math.floor(percentage) / 100

document.documentElement.style.zoom = percentage
```

## scale

> 在CSS3中，我们可以使用transform属性的scale()方法来实现元素的缩放效果。缩放，指的是“缩小”和“放大”的意思

```js
import { ref } from 'vue'

export function useDraw() {
  // 指向外层容器
  const appRef = ref()
  const timer = ref(null)
  // 默认缩放值
  const scale = {
    width: '1',
    height: '1'
  }

  // 设计搞尺寸（px）
  const baseWidth = 1920
  const baseHeight = 1080

  // 需保持的比例 （默认 1.77778）
  const baseProportion = parseFloat((baseWidth / baseHeight).toFixed(5))
  const calcRate = () => {
    // 当前宽高比
    const currentRate = parseFloat((window.innerWidth / window.innerHeight).toFixed(5))
    if (appRef.value) {
      if (currentRate > baseProportion) {
        // 表示更宽
        scale.width = ((window.innerHeight * baseProportion) / baseWidth).toFixed(5)
        scale.height = (window.innerWidth / baseHeight).toFixed(5)
        appRef.value.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
      } else {
        // 表示更高
        scale.height = ((window.innerWidth / baseProportion) / baseHeight).toFixed(5)
        scale.width = (window.innerWidth / baseWidth).toFixed(5)
        appRef.value.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
      }
    }
  }

  const resize = () => {
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      calcRate()
    }, 200)
  }

  // 改变窗口大小重新绘制
  const windowDraw = () => {
    window.addEventListener('resize', resize)
  }

  const unWindowDraw = () => {
    window.removeEventListener('resize', resize)
  }

  return {
    appRef,
    calcRate,
    windowDraw,
    unWindowDraw
  }
}
```

```vue
<!-- 使用 -->
<template>
  <div ref="appRef">xx</div>
</template>
<script setup>
const { appRef, calcRate, windowDraw, unWindowDraw } = useDraw()

onMounted(() => {
  windowDraw()
  calcRate()
})
onUnmounted(() => {
  unWindowDraw()
})
</script>
```


## rem 

> rem 是指相对于根元素的字体大小的单位，在日常开发过程中，我们通常把根元素（html、body) 的字体设置为 10px，方便于我们计算（此时子元素的 1rem 就相当于 10px ）
> 适用场景：不固定宽高比的 WEB 应用，适用于绝大部分业务场景

#### 安装依赖

`pnpm add postcss-pxtorem autoprefixer amfe-flexible -D`

- `postcss-pxtorem` 是用于将 像素单位 生成 rem 单位
- `autoprefixer` 处理浏览器前缀
- `amfe-flexible` 可伸缩布局方案，替代 `lib-flexible`

#### 创建 `postcss.config.js` 和 引入 `amfe-flexible`

```js
// postcss.config.js
module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        "Android 4.1",
        "ios 7.1",
        "Chrome > 31",
        "ff > 31",
        "ie >= 8",
        "last 10 versions"
      ],
      grid: true
    },
    "postcss-pxtorem": {
      rootValue: 192, // 设计稿宽度的1/ 10 例如设计稿按照 1920设计 此处就为192
      propList: ["*", "!border"], // 除 border 外所有px 转 rem
      selectorBlackList: [".el-"], // 过滤掉.el-开头的class，不进行rem转换
    }
  }
}
```

```js
// amfe-flexible
import 'amfe-flexible/index.js'
```
