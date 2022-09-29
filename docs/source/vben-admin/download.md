
1. 文件流 下载
2. 文件地址 下载
3. base64 下载
4. 图片Url 下载

## 文件流下载

```ts
/**
 * 文件流下载
 * @param data 下载的数据流
 * @param filename 文件名称
 * @param mime 类型
 * @param bom
 */
export function downloadByData(data: BlobPart, filename: string, mime?: string, bom?: BlobPart) {
  const blobData = typeof bom !== 'undefined' ? [bom, data] : [data];
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' });

  const blobURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = blobURL;
  tempLink.setAttribute('download', filename);
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank');
  }
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(blobURL);
}

downloadByData('text content', 'testName.txt');
```


## 文件地址下载

```ts
type TargetContext = '_self' | '_blank';
/**
 * 文件地址下载
 * @param param0 地址，方式，文件名
 * @returns
 */
export function downloadByUrl({
  url,
  target = '_blank',
  filename,
}: {
  url: string;
  target?: TargetContext;
  filename?: string;
}) {
  const isChrome = window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  const isSafari = window.navigator.userAgent.toLowerCase().indexOf('safari') > -1;

  if (/(iP)/g.test(window.navigator.userAgent)) {
    console.error('你的浏览器不支持下载');
    return false;
  }
  if (isChrome || isSafari) {
    const link = document.createElement('a');
    link.href = url;
    link.target = target;

    if (link.download !== undefined) {
      link.download = filename || url.substring(url.lastIndexOf('/') + 1, url.length);
    }

    if (document.createEvent) {
      const e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      return true;
    }
  }
  if (url.indexOf('?') === -1) {
    url += '?download';
  }

  openWindow(url, { target });
  return true;
}

/**
 * 打开窗口
 * @param url 地址
 * @param opt 配置项
 */
export function openWindow(
  url: string,
  opt?: { target?: TargetContext | string; noopener?: boolean; noreferrer?: boolean },
) {
  const { target = '_blank', noopener = true, noreferrer = true } = opt || {};
  const feature: string[] = [];

  noopener && feature.push('noopener=yes');
  noreferrer && feature.push('noreferrer=yes');

  window.open(url, target, feature.join(','));
}


downloadByUrl({
  url: 'https://codeload.github.com/anncwb/vue-vben-admin-doc/zip/master',
  target: '_self',
})
```

## `base64 下载`

```ts
// base64 流下载
/**
 * base64 流下载
 * @param buf buffer流
 * @param filename 文件名
 * @param mime 类型
 * @param bom
 */
export function downloadByBase64(buf: string, filename: string, mime?: string, bom?: BlobPart) {
  const base64Buf = dataURLtoBlob(buf);
  downloadByData(base64Buf, filename, mime, bom);
}
/**
 * base64 to blob
 * @param base64Buf
 */
export function dataURLtoBlob(base64Buf: string): Blob {
  const arr = base64Buf.split(',');
  const typeItem = arr[0];
  const mime = typeItem.match(/:(.*?);/)![1];
  const bstr = window.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// imgBase64 base64
downloadByBase64(imgBase64, 'logo.png');

```

## 图片Url下载

```ts
// 图片 url 下载
/**
 * 图片 url 下载
 * @param url 地址
 * @param filename 文件吗
 * @param mime 类型
 * @param bom
 */
export function downloadByOnlineUrl(url: string, filename: string, mime?: string, bom?: BlobPart) {
  urlToBase64(url).then((base64) => {
    downloadByBase64(base64, filename, mime, bom);
  });
}

type Nullable<T> = T | null;
/**
 * imgUrl to base64
 * @param url url
 * @param mineType 类型
 */
export function urlToBase64(url: string, mineType?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement('canvas') as Nullable<HTMLCanvasElement>;
    const ctx = canvas!.getContext('2d');

    const img = new Image();
    img.crossOrigin = '';
    img.onload = function () {
      if (!canvas || !ctx) {
        return reject();
      }
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL(mineType || 'image/png');
      canvas = null;
      resolve(dataURL);
    };
    img.src = url;
  });
}

downloadByOnlineUrl(
  'https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5944817f47b8408e9f1442ece49d68ca~tplv-k3u1fbpfcp-watermark.image',
  'logo.png',
);

```
