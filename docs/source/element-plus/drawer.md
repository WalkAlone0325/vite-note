# drawer

1. 类似 `dialog`
2. 区别于 样式的不同

```css
.drawer {
  position: absolute;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.body {
  flex: 1;
}
```

```vue
<template>
  <teleport to="body" :disabled="false">
    <transition>
      <!-- 遮罩 -->
      <el-overlay v-show="visible" @click="onModalClick">
        <div>
          <!-- 头部 -->
          <header>
            <slot name="header" />
          </header>
          <!-- 内容 -->
          <slot />
          <!-- 尾部 -->
          <div v-if="$slots.footer">
            <slot name="footer" />
          </div>
        </div>
      </el-overlay>
    </transition>
  </teleport>
</template>
```
