> css 面试相关

## css 选择器及其优先级

id > 类 > 属性> 伪类 > 标签 > 相邻兄弟 > 子 > 后代 > 通配符

## 隐藏元素的方法

- `display: none` ：渲染树不会包含该渲染对象，因此该元素不会再页面中占据位置，也不会响应监听的事件
- `visibility: hidden` ：元素在页面中占据空间，但是不会响应绑定的监听事件
- `opacity: 0` ：透明度为 0
- `position: absolute` ：使用绝对定位讲元素溢出可视区域内
- `z-index: 负值` ：来使其他元素盖住钙元素
- `transform: scale(0,0)` ：将元素缩放为 0

## link 和 @import 的区别

- link 是XHML标签，除了加载css外，还可以定义RSS等；@import属于css，只能加载css
- link 引用css时，页面载入时同时加载；@import需要页面完全载入后加载
- @import 是css2.1提出的，在低版本浏览器中不支持
- link 支持使用 js 控制 DOM 改变样式；@import 不支持

## transition 和 animation 的区别

- transition 是过度属性。需要触发一个事件才能执行
- animation 是动画属性。不需要触发事件，设定好时间之后可以自己执行，且可以循环一个动画

## display: none 和 visibility: hidden 的区别

- 前者会让元素完全从渲染树中消失，渲染时不会占据任何空间
- 后者不会染钙元素从渲染树中消失，还会占据相应的空间，只是内容不可见

## 对盒模型的理解

- 标准盒子模型 ：`box-sizing: content-box` （width 和 height 只包含 content）
- IE盒子模型 ：`box-sizing: border-box` （width 和 height 包含了border padding content）

## css3 中的新特性

- 圆角 border-radius
- 多列布局 multi-column layout
- 阴影和反射 shadow eflect
- 文字特效 text-shadow
- 线性渐变 gradient
- 旋转 transform
- css3 动画

## 单行 多行文本溢出隐藏

```css
overflow: hidden; // 溢出隐藏
text-overlow: ellipsis; // 溢出显示省略号
white-space: nowarp; // 文本不换行
```

```css
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式：从上到下垂直排列
-webkit-line-clamp: 3; // 显示的行数
```

## flex

容器属性：
- `flex-direction` ：决定主轴排列方向
- `flex-wrap` ：如何换行
- `flex-flow` ：前两个简写 默认值为 `row nowrap`
- `justify-content` ：主轴对齐方式
- `align-items` ：交叉轴的排列方式
- `align-content` ：多根轴线的对齐方式

项目属性：
- `order` ：定义项目的排列顺序。数值越小，排列越靠前，默认为0
- `flex-grow` ：定义项目的放大比例，默认为0，即有剩余空间，也不放大
- `flex-shrink` ：定义项目的缩小比列，默认为1，即空间不足，将缩小
- `flex-basis` ：定义了在分配多余空间之前，项目占据的主轴空间。浏览器根据这个属性计算主轴是否有多余空间。默认值为auto，即项目的本来大小
- `flex` ：前三个属性的简写，默认值为 `0 1 auto`
- `align-order` ：允许单个项目有与其他项目不一样的对齐方式，可覆盖 `align-items`。默认值为 auto，表示继承父元素的`align-items`。如果没有父元素，则等同于 `stretch`

`flex: 1` 表示 `flex: 1 1 0%`。放大缩小比例为1，计算多余空间为0%
`flex: initial` 默认，表示 `flex: 0 1 auto`
`flex: auto` 表示 `flex: 1 1 auto`

## position 的属性

- absolute 绝对定位，相对于 static 以外的一个父元素
- relative 相对定位
- fixed 决定定位，相对于屏幕视口（viewport）
- static 默认值，没有定位
- inherit 从父元素继承
