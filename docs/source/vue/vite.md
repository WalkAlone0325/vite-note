# Vite 

`packages/vite/src/node/cli.ts`

## dev

```js
const { createServer } = await import('./server')

const server = await createServer({})
```

### createServer

`packages/vite/src/node/server/index.ts`

1. `middlewareMode`
2. `httpServer`
3. `watcher`
4. `ws`

