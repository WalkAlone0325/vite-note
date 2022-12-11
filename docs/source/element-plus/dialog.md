# dialog 

1. 外层 `Teleport` 组件，确定容器渲染位置
2. `Transition` 组件，设置弹窗的过渡动画效果
3. `el-overlay` 组件，设置遮罩层
4. `div` 内容区，分为 头部、内容、底部
   1. 头部使用插槽 `<slot name="header" />`
   2. 内容使用插槽 `<slot />` 做默认插槽位置
   3. 底部使用插槽 `<slot name="footer" />`，并使用 `$slots.footer` 判断底部插槽是否需要

```vue
<script setup lang="ts">
import ElOverLay from './el-overlay.vue'
</script>

<template>
  <teleport to="body" :disabled="!appendToBody">
    <transition name="dialog-fade">
      <!-- 遮罩 -->
      <el-overlay>
        <!-- dialog的内容 -->
        <div>
          <header ref="headerRef">
            <slot name="header">
              <span>头部</span>
            </slot>
            <button>关闭按钮</button>
          </header>
          <div>
            <!-- 内容区 -->
            <slot />
          </div>
          <footer v-if="$slots.footer">
            <slot name="footer" />
          </footer>
        </div>
      </el-overlay>
    </transition>
  </teleport>
</template>
```
