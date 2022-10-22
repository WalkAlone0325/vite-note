# 事件

> JavaScript 和 HTML 的交互是通过 **事件** 实现的，事件代表文档或浏览器窗口中某个有意义的时刻。可以使用仅在事件发生时执行的监听器（也叫处理程序）订阅事件。也被称为 ”观察者模式“，其能够做到页面行为（在js中定义）与页面展示（在HTML和CSS中定义）的分离。

## 事件流

> 事件流描述了页面接收事件的顺序。分为 **事件冒泡流** 和 **事件捕获流**

### 事件冒泡

> IE 事件被称为 **事件冒泡**，这是因为事件被定义为从最具体的元素（文档树种最深的节点）开始触发，然后向上传播至没有那么具体的元素（文档）。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Document</title>
</head>
<body>
  <div id="myDiv">Click Me</div>
</body>
</html>
```

在点击页面中的 `<div>` 元素后，`click` 事件会以如下顺序发生：

1. `<div>`
2. `<body>`
3. `<html>`
4. `document`

现代浏览器中的事件会一直冒泡到 `window` 对象

### 事件捕获

> 事件捕获的意思是最不具体的节点应该最先收到事件，而最具体的节点应该最后收到事件。事件捕获实际上是为了在事件到达最终目标前拦截事件。

通常情况建议使用事件冒泡，特殊情况下可以使用事件捕获。

### DOM 事件流

`DOM2 Events` 规范规定事件流分为3个阶段： **事件捕获** 、 **到达目标** 、 **事件冒泡**。事件捕获最先发生，为提前拦截事件提供了可能。然后，实际的目标元素接收到事件。最后一个是冒泡，最迟要在这个阶段响应事件。

## 事件处理程序

> 事件意味着用户或浏览器执行的某种动作。比如，单击、加载、鼠标悬停。为响应事件而调用的函数被称为 **事件处理程序**（**事件监听器**）。事件处理程序的名字以 ”`on`“ 开头。

### HTML 事件处理程序

```html
<input type="button" value="Click Me" onclick="console.log('Clicked')" />
```

### DOM0 事件处理程序

```js
let btn = document.getElementById('myBtn')
btn.onclick = function() {
  console.log('Clicked')
}
```

通过将事件的处理程序属性的值设置为 `null`，可以移除通过 DOM0 方式添加的事件处理程序。`btn.onclick = null`

### DOM2 事件处理程序

`DOM2 Events` 为事件处理程序的赋值和移除定义了两个方法： `addEventListener()` 和 `removeEventListener()`。这两个方法暴露在所有的 DOM 节点上，他们接收三个参数：事件名 、 事件处理程序 、 一个布尔值，`true` 表示在**捕获阶段**调用事件处理程序，`false` （默认值）表示在**冒泡阶段**调用事件处理程序。

**默认在事件冒泡阶段**

```js
let btn = document.getElementById('myBtn')

const handler = function() {
  console.log('Clicked')
}
btn.addEventListener('click', handler, false)
btn.removeEventListener('click', handler, false)
```

移除事件必须使用 `removeEventListener`, 而且必须传入同一个事件处理函数

### IE 事件处理程序

`attachEvent()` 和 `detachEvent()`

```js
var btn = document.getElementById('myBtn')

btn.attachEvent('onClick', function() {
  console.log('Clicked')
})
```

### 跨浏览器事件处理程序

```js
var EventUtil = {
  addHandler: function (element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false)
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler)
    } else {
      element['on' + type] = handler
    }
  },
  removeHandler: function (element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false)
    } else if (element.detachEvent) {
      element.detachEvent('on' + type, handler)
    } else {
      element['on' + type] = null
    }
  }
}
```

## 事件类型

- **用户界面事件（UIEvent）** ： 涉及与 BOM 交互的通用浏览器事件
- **焦点事件（FocusEvent）** ： 在元素获得和失去焦点时触发
- **鼠标事件（MouseEvent）** ： 使用鼠标在页面上执行某些操作时触发
- **滚轮事件（WheelEvent）** ： 使用鼠标滚轮（或类似设备）时触发
- **输入事件（InputEvent）** ： 向文档中输入文本时触发
- **键盘事件（KeyBoardEvent）** ： 使用键盘在页面上执行某些操作时触发
- **合成事件（UIEvent）** ： 使用某种 IME（输入法编辑器）输入字符时触发

## 内存与性能

1. 最好限制一个页面中事件处理程序的数量，因为他们会占用过多内存，导致页面响应缓慢
2. 利用事件冒泡，事件委托可以解决限制事件处理程序数量的问题
3. 最好在页面卸载之前删除所有事件处理程序

### 事件委托

> 利用事件冒泡的机制，可以只使用一个事件处理程序来管理一种类型的事件

### 删除事件处理程序
