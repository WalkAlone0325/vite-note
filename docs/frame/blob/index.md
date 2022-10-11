# File Blob FileReader ArrayBuffer Base64

![blob 关系图](/blob.png)

## Blob

> Blob 全称为 `binary large object`，即二进制大对象，blob对象本质上是 js 中的一个对象，里面可以储存大量的二进制编码格式的数据。Blob 对象一个不可修改，从 Blob 中读取内容的唯一方法是使用 `FileReader`

### 创建

> `new Blob(array, options)`
> 两个参数：
> 1. array： 由 `ArrayBuffer` `ArrayBufferView` `Blob` `DOMString` 等对象构成的，将会被放进 `Blob`
> 2. options： 它可能会有两个属性：
>     1. type： 默认值为 `''`，表示将会被放入到blob中数组内容的 `MIME` 类型
>     2. endings： 默认值为 `transparent`，用于指定包含结束符 `\n` 的字符串如何被写入，不常用


|     MIME 类型      |      描述       |
| :----------------: | :-------------: |
|    `text/plain`    |   纯文本文档    |
|    `text/html`     |    html文档     |
| `text/javascript`  | JavaScript 文件 |
|     `text/css`     |    CSS 文件     |
| `application/json` |    JSON 文件    |
| `application/pdf`  |    PDF 文件     |
| `application/xml`  |    XML 文件     |
|    `image/jpeg`    |    JPEG 图像    |
|    `image/png`     |    PNG 图像     |
|    `image/gif`     |    GIF 图像     |
|  `image/svg+xml`   |    SVG 图像     |
|    `audio/mpeg`    |    MP3 文件     |
|    `video/mpeg`    |    MP4 文件     |

```ts
let blob = new Blob(['helloWorld'], { type: 'text/plain' })
```
![Blob](/blobShow.png)

::: tip
blob对象上有两个属性：
1. size： Blob 对象中所包含的数据大小（字节）
2. type： 字符串，认为该对象所包含的 MIME 类型，如果类型未知，则为空字符串
:::

### 分片

> Blob 对象内置可 `slice()` 方法用来将对象分片
> 
> 其有三个参数：
> 1. `start`： 设置切片的起点，即切片开始的位置，默认为0，这意味着切片应该从第一个字节开始
> 2. `end`： 设置切片的终点，会对该位置之前的数据进行切片，默认值为 `blob.size`
> 3. `contentType`： 设置新 `blob` 的 `MIME类型`，如果省略 `type`，则默认为 `blob` 的原始值

![blob slice](/blobSlice.png)

## File

> `File` 对象是特殊类型的 `Blob`
> 在 js 中，主要有两种方式来获取 `File` 对象：
> 1. `<input>` 元素上选择文件后返回的 `FileList` 对象
> 2. 文件拖放操作生成的 `DataTransfer` 对象

```html
<input type="file" name="" id="fileId">
<script>
  let fileObj = document.getElementById('fileId')
  fileObj.onchange = function (e) {
    console.log(e.target.files)
  }
</script>
```
![input file](/inputfile.png)

```html
<style>
  .drapArea {
    width: 300px;
    height: 300px;
    border: 1px solid red;
  }
</style>
<div class="drapArea" id="dropId" />
<script>
  let dropObj = document.getElementById('dropId')
  dropObj.ondragover = function (e) {
    e.preventDefault()
  }
  dropObj.ondrop = function (e) {
    e.preventDefault()
    let files = e.dataTransfer.files
    console.log(files)
  }
</script>
```

![file drop](/fileDrop.png)

## FileReader

> 通过上面知道了 `blob` 是不可修改也是无法读取里面的内容的，读取内容需要通过 `FileReader` 方法

![readerAsXx](/readerAsXx.png)

FileReader 对象提供了以下方法来加载文件：
1. `readerAsArrayBuffer()` : 读取指定 Blob 中的内容，完成之后，`result` 属性中保存的将是被读取文件 `ArrayBuffer` 数据对象
2. `readerAsBinaryString()` : 读取指定 Blob 中的内容，完成之后，`result` 属性中将包含所读文件原始二进制数据
3. `readerAsDataURL()` : 读取指定 Blob 中的内容，完成之后，`result` 属性中将包含一个 `data: URL` 格式的 `Base64` 字符串以表示所读取文件的内容
4. `readerAsText()` : 读取指定 Blob 中的内容，完成之后，`result` 属性中将包含一个字符串表示所读文件内容 

```html
<input type="file" name="" id="fileId">

<script>
  let fileObj = document.getElementById('fileId')
  fileObj.onchange = function (e) {
    let files = e.target.files
    let reader = new FileReader()
    reader.readAsDataURL(files[0])
    reader.onload = function (event) {
      let base64 = event.target.result
      console.log(base64)
    }
  }
</script>
```

![readerBase64](/readerBase64.png)  
![blob slice](/blobSlice.png)

## ArrayBuffer

> 可以理解为特殊的数组：`ArrayBuffer` 本身就是一个黑盒，不能直接读写所储存的数据，需要借助一下视图对象来读写 `TypedArray` 只是一个概念，实际使用的是那9个对象

![ArrayBuffer](/ArrayBuffer.png)

### 创建 ArrayBuffer

> `new ArrayBuffer(bytelength)`
> 参数： bytelength 表示要创建数据缓存区的大小，以字节为单位

![newArrayBuffer](/newArrayBuffer.png)

### TypedArray 读写 buffer
  
![readerIntBuffer](/readerIntBuffer.png)

### DataView 读写 buffer

DataView 实例提供了以下方法来读取内存，他们的参数都是一个字节序号，表示开始读取的字节的位置：
1. `getInt8` : 读取1个字节，返回一个8位整数
2. `getUnit8` : 读取1个字节，返回一个无符号8位整数
3. `getInt16` : 读取2个字节，返回一个16位整数
4. `getUnit16` : 读取2个字节，返回一个无符号16位整数
5. `getInt32` : 读取4个字节，返回一个32位整数
6. `getUnit32` : 读取4个字节，返回一个无符号32位整数
7. `getFloat32` : 读取4个字节，返回一个32位浮点数
8. `getFloat64` : 读取8个字节，返回一个64位浮点数

DataView 实例提供了以下方法来写入内存，它们接收两个参数，第一个参数表示开始写入数据的字节序号，第二个参数为写入的数据：
1. `setInt8` : 写入1个字节的8位整数
2. `setUint8` : 写入1个字节的8位无符号整数
3. `setInt16` : 写入1个字节的16位整数
4. `setUint16` : 写入1个字节的16位无符号整数
5. `setInt32` : 写入1个字节的32位整数
6. `setUint32` : 写入1个字节的32位无符号整数
7. `setInt64` : 写入1个字节的64位整数
8. `setUint64` : 写入1个字节的64位无符号整数

## Object URL

> 用来表示 `File Object` 或 `Blob Object` 的 `URL`

```html
<input type="file" name="" id="fileId">

<script>
  let fileObj = document.getElementById('fileId')
  fileObj.onchange = function (e) {
    let files = e.target.files
    let url = URL.createObjectURL(files[0])
    console.log(url)
  }
</script>
```

![objectUrl](/objectUrl.png)

## base64

> 在 js 中，有两个函数被分别用来处理 **解码** 和 **编码** `base64 字符串`
> 1. `atob()` : 解码，解码一个 base64字符串
> 2. `btoa()` : 编码，从一个 字符串或二进制数据编码一个 base64字符串

![atob](/atob.png)

::: tip
主要作用：
1. 将 `canvas 画布` 内容生成 `base64图片`
2. 将获取的图片文件，`生成 base64 图片`（FileReader：reader.readerAsDataURL）
:::

```html
<canvas id="canvasId" width="200" height="200"></canvas>

<script>
  let canvas = document.getElementById('canvasId')
  let context = canvas.getContext('2d')
  context.fillStyle = '#ff0000'
  context.fillRect(0, 0, 200, 200)
  let base64Str = canvas.toDataURL()

  console.log(base64Str)
</script>
```

![canvasToBase64](/canvasToBase64.png)

## 总结

1. `ArrayBuffer` 与 `Blob` 有什么区别？ 根据 `ArrayBuffer` 和 `Blob` 的特性，`Blob` 作为一个整体文件，适合用于传输；当需要对二进制数据进行操作时（比如更改某一段数据时），就可以使用 `ArrayBuffer`
2. 通过 `ArrayBuffer` 创建 `Blob` ，然后他通过 `FileReader` 读取里面的内容

![ArrayBufferAndBlob](/ArrayBufferAndBlob.png)
