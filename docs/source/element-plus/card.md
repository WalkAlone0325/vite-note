# card

1. 阴影shadow
2. 内容区
   1. 头部
   2. 内容

```vue
<template>
  <div class="shadow">
    <div v-if="$slots.header || header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div class="bodyStyle">
      <slot />
    </div>
  </div>
</template>
```
