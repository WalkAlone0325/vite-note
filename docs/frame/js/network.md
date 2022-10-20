# 网络请求和远程资源

## 跨源资源共享(协议、域名、端口)

>跨源资源共享（CORS）定义了浏览器和服务器如何实现跨源通信。CORS 背后的基本思路就是使用自定义的HTTP 头部允许浏览器和服务器相互了解，以确定请求或响应应该成功还是失败

### 预检请求

> CORS 通过一种叫 预检请求 的服务器验证机制，允许使用自定义头部、除 GET 和 POST 之外的方法，以及不同请求体的内容类型。在要发送涉及以上某种高级选项的请求时，会先向服务器发送一个“预检”请求。预检请求返回后，结果会按响应指定时间缓存一段时间。换句话说，只有第一次发送这种类型的请求时才会多发送一次额外的HTTP请求。

### 凭据请求

> 默认情况下，跨源请求不提供凭据（cookie 、HTTP 认证和客户端 SSL证书）。可以通过将 `withCredentials` 属性设置为 true 来表明请求会发送凭据。如果服务器允许带凭据的请求，那么可以在响应中包含如下HTTP头部：
> `Access-Control-Allow-Credentials: true`
> 如果发送了平局请求而服务器返回的响应中没有这个头部，则浏览器不会吧响应交给 JavaScript（`ressponseText` 是空字符串，`status` 是0，`onerror()` 被调用）

### 替代性跨源技术

1. 图片探测
2. JSONP

## Beacon API

**`Beacon`** 接口用于将异步和非阻塞请求发送到服务器。信标（Beacon）请求使用 HTTP 协议中的 POST 方法，请求通常不需要响应。这个请求被保证在，页面的**unload**状态从发起到完成之前，被发送。而并不需要一个阻塞请求，例如 [`XMLHttpRequest`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) 。

`Beacon` 接口满足了分析和诊断代码的需要，这些代码通常会尝试在卸载文档之前将数据发送到 web 服务器。发送数据的任何过早时机都可能导致错失收集数据的机会。但是，确保在卸载文档期间发送数据是开发人员难以做到的。

### 全局环境

`Beacon` API 的 [`Navigator.sendBeacon()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/sendBeacon) 方法用于在_全局浏览上下文_中向服务器发送_数据信标_。该方法有两个参数，URL 和要在请求中发送的数据 data。data 参数是可选的，其类型可以是 [`ArrayBufferView`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)、[`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)、[`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 或[`FormData`](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)。如果浏览器成功的以队列形式排列了用于传递的请求，则该方法返回“`true`”，否则返回“`false`”。

### 生产环境

`Beacon` API 的 `WorkerNavigator.sendBeacon()` 方法用于从 _[`worker global scope`](https://developer.mozilla.org/zh-CN/docs/Web/API/WorkerGlobalScope "worker global scope")_ 向服务器发送_数据信标_。该方法有两个参数，URL 和要在请求中发送的数据 data。data 参数是可选的，其类型可以是 [`ArrayBufferView`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)、[`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)、[`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 或 [`FormData`](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)。如果浏览器成功的以队列形式排列了用于传递的请求，则该方法返回“`true`”，否则返回“`false`”。

## Web Socket

> Web Socket（套接字）的目标是通过一个长连接实现与服务器全双工、双向的通信。

### API

初始化示例：`let scoket = new WebSokcet('ws://www.example.com/server')`

WebSocket 有一个 `readyState` 属性表示当前状态
- `WebSocket.OPENING（0）`：连接正在建立
- `WebSocket.OPEN（1）`：连接已经建立
- `WebSocket.CLOSEING（2）`：连接正在关闭
- `WebSocket.CLOSE（3）`：连接已经关闭
任何时候都可以调用 `close()` 方法来关闭连接

### 发送和接收数据

要向服务器发送数据，使用 `send()` 方法并传入一个 `字符串`、`ArrayBuffer`、`Blob`，如下：

```js
let socket = new WebSocket(`ws:www.example.com`)

let stringData = 'Hello World'
let arrayBufferData = Uint8Array.from(['f', 'o', 'o'])
let blobData = new Blob(['f', 'o', 'o'])

socket.send(stringData)
socket.send(arrayBufferData)
socket.send(blobData)
```

服务器向客户端发送数据时，`WebSocket` 对象上会触发 `message` 事件，这个事件与其他消息协议类似，可以通过 `event.data` 属性访问到有效载荷：

```js
socket.onmessage = function(event) {
	let data = event.data
	// 对数据执行某些操作
}
```

与通过 `send()` 方法发送的数据类似，`event.data` 返回的数据也可能是 `ArrayBuffer` 或 `Blob`。这由 WebSocket 对象的 `binaryType` 属性决定，该属性可能是 `blob` 或 `arraybuffer`

### 其他事件

- `open` : 在连接成功建立时触发
- `error` : 在发生错误时触发。连接无法存续
- `close` : 在连接关闭时触发

## 基于Vue3 的 WebSocket 封装

```ts
import type { Ref } from 'vue'
import { ref, unref, getCurrentScope, onScopeDispose, watch, isRef } from 'vue'

type WebSocketStatus = "OPEN" | "CONNECTING" | "CLOSED"
type Fn = () => void

export interface UseWebSocketOptions {
  onConnected?: (ws: WebSocket) => void
  onDisconnected?: (ws: WebSocket, event: CloseEvent) => void
  onError?: (ws: WebSocket, event: Event) => void
  onMessage?: (ws: WebSocket, event: MessageEvent) => void

  // 心跳检测
  heartbeat?: boolean | {
    // @default 'ping' 发送信息
    message?: string
    // @default 1000 间隔时间
    interval?: 1000
  }

  // 自动重连
  autoReconnect?: boolean | {
    retries?: number | (() => boolean) // -1
    delay?: number // 1000
    onFailed?: Fn
  }

  immediate?: boolean
  autoClose?: boolean
  protocols?: string[]
}

export interface UseWebSocketReturn<T> {
  data: Ref<T | null>
  status: Ref<WebSocketStatus>
  close: WebSocket['close']
  open: Fn
  send: (date: string | ArrayBuffer | Blob, useBuffer?: boolean) => boolean
  ws: Ref<WebSocket | undefined>
}

function resolveNestedOptions<T>(options: T | true): T {
  if (options === true)
    return {} as T
  return options
}

export function useWebSocket<Data = any>(
  url: string,
  options: UseWebSocketOptions = {}
): UseWebSocketReturn<Data> {
  const {
    onConnected,
    onDisconnected,
    onError,
    onMessage,
    immediate = true,
    autoClose = true,
    protocols = []
  } = options

  const data: Ref<Data | null> = ref(null)
  const status = ref<WebSocketStatus>('CLOSED')
  const wsRef = ref<WebSocket | undefined>()

  let heartbeatPause: Fn | undefined
  let heartbeatResume: Fn | undefined

  let explicitlyClosed = false
  let retried = 0

  let bufferedData: (string | ArrayBuffer | Blob)[] = []

  const close: WebSocket['close'] = (code = 1000, reson) => {
    if (!wsRef.value) return
    explicitlyClosed = true
    heartbeatPause?.()
    wsRef.value.close(code, reson)
  }

  const _sendBuffer = () => {
    if (bufferedData.length && wsRef.value && status.value === 'OPEN') {
      for (const buffer of bufferedData) {
        wsRef.value.send(buffer)
      }
      bufferedData = []
    }
  }

  const send = (data: string | ArrayBuffer | Blob, useBuffer = true) => {
    if (!wsRef.value || status.value !== 'OPEN') {
      if (useBuffer) {
        bufferedData.push(data)
      }
      return false
    }
    _sendBuffer()
    wsRef.value.send(data)
    return true
  }

  const _init = () => {
    const ws = new WebSocket(url, protocols)
    wsRef.value = ws
    status.value = 'CONNECTING'
    explicitlyClosed = false

    ws.onopen = () => {
      status.value = 'OPEN'
      onConnected?.(ws!)
      heartbeatResume?.()
      _sendBuffer()
    }

    ws.onclose = (ev) => {
      status.value = 'CLOSED'
      wsRef.value = undefined
      onDisconnected?.(ws, ev)

      if (!explicitlyClosed && options.autoReconnect) {
        const {
          retries = -1,
          delay = 1000,
          onFailed,
        } = resolveNestedOptions(options.autoReconnect)
        retried += 1

        if (typeof retries === 'number' && (retries < 0 || retried < retries)) {
          setTimeout(_init, delay)
        } else if (typeof retries === 'function' && retries()) {
          setTimeout(_init, delay)
        } else {
          onFailed?.()
        }
      }
    }

    ws.onerror = (e) => {
      onError?.(ws!, e)
    }

    ws.onmessage = (e: MessageEvent) => {
      data.value = e.data
      onMessage?.(ws!, e)
    }
  }

  if (options.heartbeat) {
    const { message = 'ping', interval = 1000 } = resolveNestedOptions(options.heartbeat)

    const { pause, resume } = useIntervalFn(
      () => send(message, false),
      interval,
      { immediate: true }
    )

    heartbeatPause = pause
    heartbeatResume = resume
  }

  if (immediate) {
    _init()
  }

  if (autoClose) {
    window.addEventListener('beforeunload', () => close())
    tryOnScopeDispose(close)
  }

  const open = () => {
    close()
    retried = 0
    _init()
  }

  return {
    data,
    status,
    close,
    send,
    open,
    ws: wsRef
  }
}

export interface UseIntervalFnOptions {
  /**
   * Start the timer immediately
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Execute the callback immediate after calling this function
   *
   * @default false
   */
  immediateCallback?: boolean
}

export const isClient = typeof window !== 'undefined'

function useIntervalFn(cb: Fn, interval = 1000, options: UseIntervalFnOptions = {}) {
  const {
    immediate = true,
    immediateCallback = false,
  } = options

  let timer: ReturnType<typeof setInterval> | null = null
  const isActive = ref(false)

  function clean() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function pause() {
    isActive.value = false
    clean()
  }

  function resume() {
    if (unref(interval) <= 0)
      return
    isActive.value = true
    if (immediateCallback)
      cb()
    clean()
    timer = setInterval(cb, resolveUnref(interval))
  }
  if (immediate && isClient)
    resume()

  if (isRef(interval)) {
    const stopWatch = watch(interval, () => {
      if (isActive.value && isClient)
        resume()
    })
    tryOnScopeDispose(stopWatch)
  }

  tryOnScopeDispose(pause)

  return {
    isActive,
    pause,
    resume,
  }
}

export function resolveUnref<T>(r): T {
  return typeof r === 'function'
    ? (r as any)()
    : unref(r)
}

function tryOnScopeDispose(fn: Fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn)
    return true
  }
  return false
}
```

