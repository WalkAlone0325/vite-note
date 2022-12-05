# Vue3 源码分析

![vue3 源码导图](/Vue3source.drawio.png)

<a href="/Vue3pdf.drawio.pdf" target="_blank">vue3 源码导图PDF</a>
<br />
<a href="/Vue3html.drawio.html" target="_blank">vue3 源码导图html</a>

## 挂载过程

> createApp => createRenderer => baseCreateRenderer => render [patch] / createAppAPI [app]

1. createApp `packages/runtime-dom/src/index.ts`
2. ensureRenderer `packages/runtime-dom/src/index.ts`
3. createRenderer `packages/runtime-core/src/renderer.ts`
4. baseCreateRenderer `packages/runtime-core/src/renderer.ts`
5. setupComponent `packages/runtime-core/src/renderer.ts` => `packages/runtime-core/src/component.ts`
6. setupComponent => initProps initSlots



调用 createApp() 创建 Vue 实例，并返回 Vue 实例。`createApp` 运行时定义在 `packages/runtime-dom/src/index.ts`，重写了 `createApp` 函数，返回 `app` 实例。

`createApp` 中调用 `ensureRenderer()` 返回 `createApp`、`render`、`hydrate`

`ensureRenderer` 函数中调用 `createRenderer()` 创建 `renderer` 实例，并返回 `renderer` 实例。

`createRenderer` 函数中调用 `baseCreateRenderer()` 创建 `renderer` 实例，并返回 `renderer` 实例。

`baseCreateRenderer` 函数返回 `render,hydrate,createApp: createAppAPI(render, hydrate)`

`patch` 函数 中的 `mountComponent` 挂载组件

`setupRenderEffect` 创建 `effect` 实例，并返回 `effect` 实例。

```ts
const effect = (instance.effect = new ReactiveEffect(
      componentUpdateFn,
      () => queueJob(update),
      instance.scope // track it in component's effect scope
    ))
```

## 编译过程 Compiler

> compiler => baseCompile [baseParse 解析生成 ast 树]=> AST [标记解析Vue语法 transform] => AST(优化和标记后的AST树) => generate [生成 render 函数] => render 函数

1. `registerRuntimeCompiler(compileToFunction)` 注册运行时编译函数
2. `compileToFunction` 将 模版编译成 `render` 函数返回 `packages/vue/src/index.ts`
3. compile `packages/compiler-dom/src/index.ts`
4. baseCompile `packages/compiler-core/src/compile.ts`，传入
    ```ts
    return baseCompile(
      template,
      extend({}, parserOptions, options, {
        // 节点转换器
        nodeTransforms: [
          // ignore <script> and <tag>
          // this is not put inside DOMNodeTransforms because that list is used
          // by compiler-ssr to generate vnode fallback branches
          ignoreSideEffectTags,
          ...DOMNodeTransforms,
          ...(options.nodeTransforms || [])
        ],
        // 指令转换s器
        directiveTransforms: extend(
          {},
          DOMDirectiveTransforms,
          options.directiveTransforms || {}
        ),
        transformHoist: __BROWSER__ ? null : stringifyStatic
      })
    )
    ```
5. `baseCompile` 中使用 `baseParse` 函数解析 生成 `ast` 树 并返回 `generate` 函数
6. `generate` 生成 `render` 函数，并返回 `render` 函数（`code`） `packages/compiler-core/src/codegen.ts`

    ```ts
    // 返回 code 
    return generate(ast, extend({}, options, {
      prefixIdentifiers
    }))
    ```

    ```ts
    const { code } = compile(template)

    const render = (
      __GLOBAL__ ? new Function(code)() : new Function('Vue', code)(runtimeDom)
    )
    ```
