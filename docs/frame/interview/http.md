## 1. Get 和 Post 请求的区别

- **应用场景**： (GET 请求是一个幂等的请求)一般 Get 请求用于对服务器资源不会产生影响的场景，比如说请求一个网页的资源。(而 Post 不是一个幂等的请求)一般用于对服务器资源会产生影响的情景，比如注册用户这一类的操作。（幂等是指一个请求方法执行多次和仅执行一次的效果完全相同）
- **是否缓存**： 因为两者应用场景不同，浏览器一般会对 Get 请求缓存，但很少对 Post 请求缓存。
- **传参方式不同**： Get 通过查询字符串传参，Post 通过请求体传参。
- **安全性**： Get 请求可以将请求的参数放入 url 中向服务器发送，这样的做法相对于 Post 请求来说是不太安全的，因为请求的 url 会被保留在历史记录中。
- **请求长度**： 浏览器由于对 url 长度的限制，所以会影响 get 请求发送数据时的长度。这个限制是浏览器规定的，并不是 RFC 规定的。
- **参数类型**： get参数只允许ASCII字符，post 的参数传递支持更多的数据类型(如文件、图片)。

## 2. Post 和 Put 请求的区别

- PUT请求是向服务器端发送数据，从而修改数据的内容，但是不会增加数据的种类等，也就是说无论进行多少次PUT操作，其结果并没有不同。（可以理解为时**更新数据**）

- POST请求是向服务器端发送数据，该请求会改变数据的种类等资源，它会创建新的内容。（可以理解为是**创建数据**）

### 为什么 Post 请求会发送两次请求？

1. 第一次请求为 `options` 预检请求，状态码为 `204`
   1. 询问服务器是否支持修改的请求头，如果服务器支持，则在第二次中发送真正的请求
   2. 检测服务器是否为同源请求，是否支持跨域
2. 第二次请求为真正的 `post` 请求

## 3. 常见的 HTTP 请求头和响应头

### HTTP Request Header

1. Accept ：浏览器能够处理的内容类型
2. Accpet-Charset ：浏览器能够显示的字符集
3. Accept-Encoding ：浏览器能够处理的压缩编码
4. Accept-Language ：浏览器当前设置的语言
5. Connection ：浏览器与服务器之间连接的类型
6. Cookie ：当前页面设置的任何 Cookie
7. Host ：发出请求的页面所在的域
8. Referer ：发出请求的页面的URL
9. User-Agent ：浏览器的用户代理字符串

### HTTP Responses Header

1. Date ：表示消息发送的时间，时间的描述格式由 rfc822 定义
2. server ：服务器名称
3. Connection ：浏览器和服务器之间的连接类型
4. Cache-Control ：控制 HTTP 缓存
5. content-type ：表示后面的文档属于什么 MIME 类型

### 常见的 Content-Type

1. `application/x-www-form-urlencorded` : 浏览器原生的 form 表单，如果不设置 enctype 属性，那么最终会以 `application/x-www-form-urlencorded` 方式提交数据。该种方式提交的数据放在 `body` 里面，数据按照 `key1=val1&key2=val2` 的方式进行编码，key 和 val 都进行了 URL转码。
2. `multipart/form-data` : 该种方式也是常见的 Post 提交方式，通常表单上传文件时使用该方式。
3. `application/json` : 服务器消息主体是序列化后的 JSON 字符串
4. `text/xml` : 该种方式主要用来提交 XML 格式的数据

## 4. HTTP 状态码 304 是多好还是少好

服务器为了提高网站的访问速度，对之前访问的部分页面指定缓存机制，当客户端在次对这些页面进行请求，服务器会根据缓存内存判断页面与之前是否相同，若相同便直接返回 304 ，此时客户端调用缓存内容，不必进行二次下载

### 产生较多 304 状态码的原因：

- 页面的更新周期长或不更新
- 纯静态页面或强制生成静态 html

### 造成的问题

- 网站快照停止
- 收录减少
- 权重下降

## 5. 常见的 HTTP 请求方法

1. `GET` : 向服务器获取数据
2. `POST` : 发送数据给服务器，通常会造成服务器资源的新增修改
3. `PUT` : 用于全量修改目标资源（看接口，也可以用于添加）
4. `PATCH` : 用于对资源的部分修改
5. `DELETE` : 用于删除指定资源
6. `HEAD` : 获取报文首部，与 get 相比，不返回报文主体部分；使用常见是比如下载一个大文件前，先获取其大小再决定是否要下载，以此可以节约宽带资源
7. `OPTIONS` : （浏览器自执行）询问支持的请求方法，用来跨域请求、预检请求、判断目标是否安全
8. `CONNECT` : 要求在与代理服务器通信时建立管道，使用管道进行TCP通信；（把服务器作为跳板，让服务器代替用户访问其他网页，之后把数据原原本本的返回给用户）
9. `TRACE` : 该方法会让服务器原样返回任意客户端请求的信息内容，主要用于测试和诊断

## 6. HTTP1.0 和 HTTP1.1 之间的区别

- 连接方面，http1.0 默认使用非持久连接，而 http1.1 默认使用持久连接。http1.1 通过使用持久连接来使多个 http 请求复用同一个 TCP 连接，以此来避免使用非持久连接时每次需要建立连接的时延。
- 资源请求方面，在 http1.0 中，存在一些浪费带宽的现象，例如客户端只是需要某个对象的一部分，而服务器却将整个对象送过来了，并且不支持断点续传功能，http1.1 则在请求头引入了 range 头域，它允许只请求资源的某个部分，即返回码是 206（Partial Content），这样就方便了开发者自由的选择以便于充分利用带宽和连接。
- 缓存方面，在 http1.0 中主要使用 header 里的 If-Modified-Since、Expires 来做为缓存判断的标准，http1.1 则引入了更多的缓存控制策略，例如 Etag、If-Unmodified-Since、If-Match、If-None-Match 等更多可供选择的缓存头来控制缓存策略。
- http1.1 中新增了 host 字段，用来指定服务器的域名。http1.0 中认为每台服务器都绑定一个唯一的 IP 地址，因此，请求消息中的 URL 并没有传递主机名（hostname）。但随着虚拟主机技术的发展，在一台物理服务器上可以存在多个虚拟主机，并且它们共享一个IP地址。因此有了 host 字段，这样就可以将请求发往到同一台服务器上的不同网站。
http1.1 相对于 http1.0 还新增了很多请求方法，如 PUT、HEAD、OPTIONS 等。

## 7. HTTP和HTTPS协议的区别

- HTTPS 协议需要 CA证书，费用较高；HTTP 协议不需要
- HTTP 协议是超文本传输协议，信息是明文传输的；HTTPS 则具有安全性的 SSL加密传输协议
- 使用不同的连接方式，端口也不同，HTTP 协议是 80；HTTPS 协议是 443
- HTTP 协议连接很简单，是无状态的；HTTPS 协议是有 SSL 和 HTTP 协议构建的可进行加密传输、身份认证的网络协议，比 HTTP 更加安全

## 8. 一个页面从输入 URL 到页面加载显示完成，这个过程中都发生了什么？

1. 解析URL： 首先会对 URL 进行解析，分析所需要使用的传输协议和请求的资源的路径。如果输入的 URL 中的协议或者主机名不合法，将会把地址栏中输入的内容传递给搜索引擎。如果没有问题，浏览器会检查 URL 中是否出现了非法字符，如果存在非法字符，则对非法字符进行转义后再进行下一过程。
2. 缓存判断： 浏览器会判断所请求的资源是否在缓存里，如果请求的资源在缓存里并且没有失效，那么就直接使用，否则向服务器发起新的请求。
3. DNS解析： 下一步首先需要获取的是输入的 URL 中的域名的 IP 地址，首先会判断本地是否有该域名的 IP 地址的缓存，如果有则使用，如果没有则向本地 DNS 服务器发起请求。本地 DNS 服务器也会先检查是否存在缓存，如果没有就会先向根域名服务器发起请求，获得负责的顶级域名服务器的地址后，再向顶级域名服务器请求，然后获得负责的权威域名服务器的地址后，再向权威域名服务器发起请求，最终获得域名的 IP 地址后，本地 DNS 服务器再将这个 IP 地址返回给请求的用户。用户向本地 DNS 服务器发起请求属于递归请求，本地 DNS 服务器向各级域名服务器发起请求属于迭代请求。
4. 获取MAC地址（选说） 当浏览器得到 IP 地址后，数据传输还需要知道目的主机 MAC 地址，因为应用层下发数据给传输层，TCP 协议会指定源端口号和目的端口号，然后下发给网络层。网络层会将本机地址作为源地址，获取的 IP 地址作为目的地址。然后将下发给数据链路层，数据链路层的发送需要加入通信双方的 MAC 地址，本机的 MAC 地址作为源 MAC 地址，目的 MAC 地址需要分情况处理。通过将 IP 地址与本机的子网掩码相与，可以判断是否与请求主机在同一个子网里，如果在同一个子网里，可以使用 APR 协议获取到目的主机的 MAC 地址，如果不在一个子网里，那么请求应该转发给网关，由它代为转发，此时同样可以通过 ARP 协议来获取网关的 MAC 地址，此时目的主机的 MAC 地址应该为网关的地址。
5. TCP三次握手： ，确认客户端与服务器的接收与发送能力，下面是 TCP 建立连接的三次握手的过程，首先客户端向服务器发送一个 SYN 连接请求报文段和一个随机序号，服务端接收到请求后向服务器端发送一个 SYN ACK报文段，确认连接请求，并且也向客户端发送一个随机序号。客户端接收服务器的确认应答后，进入连接建立的状态，同时向服务器也发送一个ACK 确认报文段，服务器端接收到确认后，也进入连接建立状态，此时双方的连接就建立起来了。
6. HTTPS握手（选说）： 如果使用的是 HTTPS 协议，在通信前还存在 TLS 的一个四次握手的过程。首先由客户端向服务器端发送使用的协议的版本号、一个随机数和可以使用的加密方法。服务器端收到后，确认加密的方法，也向客户端发送一个随机数和自己的数字证书。客户端收到后，首先检查数字证书是否有效，如果有效，则再生成一个随机数，并使用证书中的公钥对随机数加密，然后发送给服务器端，并且还会提供一个前面所有内容的 hash 值供服务器端检验。服务器端接收后，使用自己的私钥对数据解密，同时向客户端发送一个前面所有内容的 hash 值供客户端检验。这个时候双方都有了三个随机数，按照之前所约定的加密方法，使用这三个随机数生成一把秘钥，以后双方通信前，就使用这个秘钥对数据进行加密后再传输。
7. 发送HTTP请求
服务器处理请求,返回HTTP报文(响应)(文件)
8. 页面渲染： 浏览器首先会根据 html 文件(响应) 建 DOM 树，根据解析到的 css 文件构建 CSSOM 树，如果遇到 script 标签，则判端是否含有 defer 或者 async 属性，要不然 script 的加载和执行会造成页面的渲染的阻塞。当 DOM 树和 CSSOM 树建立好后，根据它们来构建渲染树。渲染树构建好后，会根据渲染树来进行布局。布局完成后，最后使用浏览器的 UI 接口对页面进行绘制。这个时候整个页面就显示出来了。
9. TCP四次挥手： 最后一步是 TCP 断开连接的四次挥手过程。若客户端认为数据发送完成，则它需要向服务端发送连接释放请求。服务端收到连接释放请求后，会告诉应用层要释放 TCP 链接。然后会发送 ACK 包，并进入 CLOSE_WAIT 状态，此时表明客户端到服务端的连接已经释放，不再接收客户端发的数据了。但是因为 TCP 连接是双向的，所以服务端仍旧可以发送数据给客户端。服务端如果此时还有没发完的数据会继续发送，完毕后会向客户端发送连接释放请求，然后服务端便进入 LAST-ACK 状态。客户端收到释放请求后，向服务端发送确认应答，此时客户端进入 TIME-WAIT 状态。该状态会持续 2MSL（最大段生存期，指报文段在网络中生存的时间，超时会被抛弃） 时间，若该时间段内没有服务端的重发请求的话，就进入 CLOSED 状态。当服务端收到确认应答后，也便进入 CLOSED 状态。

## 9. 与缓存相关的HTTP请求头有哪些

### 强缓存

- Expires
- Cache-Control

### 协商缓存

- Etag 、 If-None-Match
- Last-Mondified 、 If-Mondified-Since

### 强缓存 与 协商缓存

1. 强缓存： 不会向服务器发送请求，直接从缓存中读取资源，在chrome控制台的Network选项中可以看到该请求返回200的状态码，并且size显示from disk cache或from memory cache两种（灰色表示缓存）。
2. 协商缓存： 向服务器发送请求，服务器会根据这个请求的request header的一些参数来判断是否命中协商缓存，如果命中，则返回304状态码并带上新的response header通知浏览器从缓存中读取资源；

> 共同点：都是从客户端缓存中读取资源； 区别是强缓存不会发请求，协商缓存会发请求。

## 10. HTTP的keep-alive有什么作用？

**http1.0 默认关闭，需要手动开启。http1.1 后默认开启**

**作用** ： 使客户端到服务器端的链接持续有效（长连接），当出现对服务器的后续请求时， keep-alive 功能避免了建立或重新建立多次链接

**使用方法** ： 在请求头上加 `Connection: keep-alive`

**优点** ：

- 较少的CPU和内存的占用(因为要打开的连接数变少了，复用了连接)
- 减少了后续请求的延迟(无需再进行握手)

**缺点** ： 本来可以释放的资源仍旧被占用。有的请求已经结束了，但是还一直连接着。

**解决方法** ： 服务器设置过期时间和请求次数，超过这个时间或者次数就断掉连接。


## 11. axios 取消请求

```js
const controller = new AbortController()

axios.get('/foo/bar', {
  signal: controller.signal
}).then(res => { })

// 取消
controller.abort()
```

## 2. 
## 2. 
## 2. 
