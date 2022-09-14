> 面试相关

## 1. 防抖(n秒内多次触发，重新计时) 、节流（n秒内多次触发，只执行一次）

::: tip 
1. **函数防抖**：在事件被触发 n 秒后再执行回调，如果在这 n 秒内事件又被触发，则重新计时。

2. **函数节流**：规定一个单位时间，在这个单位时间内，只能有一次触发事件的回调函数执行，如果在同一个单位时间内某事件被触发多次，只有一次能生效。

1. **函数防抖**是指在事件被触发 n 秒后再执行回调，如果在这 n 秒内事件又被触发，则**重新计时**。这可以使用在一些点击请求的事件上，避免因为用户的多次点击向后端发送多次请求。

2. **函数节流**是指规定一个单位时间，在这个单位时间内，只能有一次触发事件的回调函数执行，如果在同一个单位时间内某事件被触发多次，只有一次能生效。节流可以使用在 scroll 函数的事件监听上，通过事件节流来**降低事件调用的频率**。

```js
// 防抖：
function debounce(fn, wait) {
  let timer = null

  return function() {
    const context = this
    const args = arguments

    // 如果此时存在定时器的话，则取消之前的定时器重新计时
    if(timer) {
      clearTimeout(timer)
      timer = null
    }

    // 设置定时器，使事件间隔指定事件后执行
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, wait)
  }
}

// 节流
function throttle(fn, delay) {
  const preTime = Date.now()

  return function() {
    const context = this
    const args = arguments
    const nowTime = Date.now()

    // 如果两次事件间隔超过了指定时间，则执行函数
    if(nowTime - preTime >= delay) {
      preTime = Date.now()
      return fn.apply(context, args)
    }
  }
}
```
:::

## 2. get请求传参长度的误区、get和post请求在缓存方面的区别

::: tip
1. `HTTP 协议` 未规定 `GET` 和 `POST` 的长度限制
2. `GET` 的最大长度显示是因为 浏览器 和 WEB 服务器限制了 URI 的长度
3. 不同的浏览器的WEB服务器，限制的最大长度不一样
4. 若只支持 Chrome，则最大长度 为 8182byte
:::

缓存方面的区别：

::: tip
1. get 请求类似于查找的过程，用户获取数据，可以不用每次都与数据库连接，所以可以使用缓存
2. post不同，post做的一般都是 修改和删除 的工作，所以必须与数据库进行交互，所以不能使用缓存，因此 get 请求适合于请求缓存
:::

## 3. Fetch 发送两次请求的原因

::: tip
1. 必须要在跨域的情况下
2. 除GET、HEAD和POST(content-type： application/x-www-form-urlencoded, multipart/form-data, text/plain Content-Type)以外的跨域请求（我们可以称为预检(Preflighted)的跨域请求）

`fetch` 发送 `post` 请求时，第一次发送 `Options` 请求，询问服务器是否支持修改的请求头，请求状态码是 `204`，如果服务器支持，则在第二次中发送真正的请求
:::

## 4. `Cookie`、`sessionStorage`、`localStorage`

::: tip
共同点：都是保存在浏览器端，并且是同源的

1. `Cookie` ： cookie 数据始终在同源的 http请求中携带，在浏览器和服务器间来回传递。而后两个不会自动把数据发给服务器，仅在本地保存。cookie 数据有路径 path 的概念，可以限制cookie只属于某个路径下，存储大小只有 `4k` 左右。（可在浏览器和服务器间传递，存储容量小，只有大约 4k）
2. `sessionStorage` ： 仅在当前浏览器窗口关闭前有效，不能持久保持
3. `localStorage` ： 始终有效，窗口或浏览器关闭也一直保存，因此用做持久数据；`cookie` 只在设置的cookie过期时间之前一直有效
4. `localStorage` 和 `cookie` 所有同源窗口都是共享的；
:::

`cookie` 的作用：

::: tip
1. 保存用户登录状态
2. 跟踪用户行为（地址等）
3. 定制页面（换肤，主题等）
:::

**`localStorage` 封装设置过期时间: （思路：设置的时候存进去时间，每次获取的时候先判断是否过期）**

::: tip
```js
class Storage {
  constructor (express) {
    this.express = express;
  }
  set(key, value, express) {
    let obj = {
      data: value,
      cTime: Date.now(),
      express: express || this.express
    };
    localStorage.setItem(key, JSON.stringify(obj));
  }
  get(key) {
    let item = localStorage.getItem(key);
    if (!item) {
      return null;
    }
    item = JSON.parse(item);
    let nowTime = Date.now();
    if (item.express && item.express < (nowTime - item.cTime)) {
      this.remove(key);
      return null;
    } else {
      return item.data;
    }
  }
  remove(key) {
    localStorage.removeItem(key);
  }
  clear(){
    localStorage.clear();
  }
}
```
:::

## 5. WEB 前端优化策略

::: tip
1. 减少 HTTP 请求数
2. 从设计实现层面简化页面
3. 合理设置 HTTP 缓存
4. 资源合并和压缩
5. 懒加载
:::

## 6. 重绘（Repaint） 和 回流（Reflow）

::: tip
- 重绘 是当节点需要更改外观而不会影响布局的，比如更改颜色等
- 回流 是布局或者几何属性需要改变

减少重绘和回流：
1. 使用 `translate` 代替 `top`
2. 使用 `visibility` 代替 `display: none`
3. 不使用 `table` 布局
4. 避免 DOM 深度过深
:::