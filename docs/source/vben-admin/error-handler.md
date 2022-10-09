1. Vue 本身的报错
2. script 脚本的报错
3. Promise 异步报错
4. 静态资源的错误

```ts
export function setupErrorHandle(app: App<Element>) {
  // vue
  app.config.errorHandler = vueErrorHandler

  // script
  window.onerror = scriptErrorHandler

  // Promise
  registerPromiseErrorHandler(app)

  // 静态资源的错误
  registerStaticResourceErrorHandler(app)
}
```
