# overlay

1. 通过 传入prop `mask` 属性判断是否显示遮罩背景
2. 遮罩背景传入 `onClick`, `onMousedown`, `onMouseup` 方法，触发点击遮罩事件
3. 不显示遮罩层通过设置样式隐藏遮罩背景
4. 都默认渲染插槽 `renderSlot(slots, 'default')`

```css
/* 遮罩 */
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  overflow: auto;
}

/* 没有遮罩 */
.no-mask {
  position: 'fixed';
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
} 
```

```vue
<script>
export default defineComponent({
  setup(props, { slots }) {
    return () => {
      return props.mask 
      ? createVNode('div', { onClick, onMousedown, onMouseup }, [renderList(slots, 'default')])
      : h('div', [renderSlot(slots, 'default')])
    }
  }
})
</script>
```
