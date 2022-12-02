# 详解Webpack配置（一）

> 概念：Webpack 是一种前端资源构建工具，一个静态模块打包器（module bundler）。在 webpack 看来，前端的所有资源文件（js/json/css/img/less/...）都会作为模块处理。它将根据模块的依赖关系进行静态分析，打包生成对应的静态资源（bundle）。

### webpack 的五个核心概念

1. **Entry**
   入口（Entry）指示 webpack 以哪个文件为入口起点开始打包，分析构建内部依赖图。

2. **Output**
   输出（Output）指示 webpack 打包后的资源 bundles 输出到哪里去，以及如何命名。

3. **Loader**
   loader 让 webpack 能够去处理那些非 javascript 文件（webpack 自身只理解
   javascript）

4. **Plugins**
   插件（Plugins）可以是用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量等。

5. **Mode**
   模式（Mode）指示 webpack 使用相应模式的配置。

   | 选项        | 描述                                                                                                                                                                          | 特点                       |
   | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
   | development | 会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NameModulesPligin                                                                                   | 能让代码本地调试运行的环境 |
   | production  | 会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin，FlagDependencyChunksPlugin，ModuleConcatenationPlugin，sideEffectsFlagPlugin 和 UglifyJsPlugin | 能让代码优化上线运行的环境 |



## 基础配置

### 打包 js/json

1. 运行指令：

- 开发环境：`webpack ./src/index.js -o ./build/built.js --mode=development`
  webpack 会以 `./src/index.js`  为入口文件开始打包，打包后输出到 `./build/built.js`
  整体打包环境，是开发环境
- 生产环境：`webpack ./src/index.js -o ./build/built.js --mode=production`
  webpack 会以 `./src/index.js`  为入口文件开始打包，打包后输出到 `./build/built.js`
  整体打包环境，是生产环境

2. 结论：
   1. webpack 能处理 js/json 资源，不能处理 css/img 等其他资源
   2. 生产环境 和 开发环境将 ES6 模块化编译成浏览器能识别的模块化
   3. 生产环境比开发环境多一个压缩 js 代码



### 打包 css/img

loader：1. 下载 2. 使用（配置 loader）

**webpack.config.js** 文件
作用：指示 webpack 干哪些活
**注：**所有的构建工具都是基于 nodejs 平台运行的，模块化默认采用 commonjs 规范。

```js
// resolve 用来拼接绝对路径的方法
const { resolve } = require('path')

module.exports = {
  // webpack 配置
  // 入口起点
  entry: './src/index.js',
  // 输出
  output: {
    // 输出文件名
    filename: 'built.js',
    // 输出路径
    // __dirname nodejs变量，代表当前文件的目录绝对路径
    path: resolve(__dirname, 'build')
  },
  // loader 配置
  module: {
    rules: [
      // 详细 loader 配置，不同文件需要配置不同loader
      {
        // 匹配哪些文件
        test: /\.css$/,
        // 使用哪些 loader 进行处理
        // use 数组中loader执行顺序：从右到左，从下到上 依次执行
        use: [
          // 创建style标签，将js中的样式资源插入进行，添加到 head 中生效
          'style-loader',
          // 将css文件变成 commonjs 模块加载到js中，里面内容是样式字符串
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          // 将 less 文件编译成 css 文件
          // 需要下载 less 和 less-loader
          'less-loader'
        ]
      }
    ]
  },
  // plugins 配置
  plugins: [],
  // 模式
  mode: 'develpoment' // 开发模式
  // mode: 'production'
}
```



### 打包 html

plugins：

1. 下载：
   `npm i html-webpack-plugin -D`

2. 引入：
   `const HtmlWebpackPlugin = require('html-webpack-plugin')`

3. 使用：

   ```js
   module.exports = {
     plugins: [
       // html-webpack-plugin，功能：默认会创建一个空的 HTML，自动引入打包输出的所有资源（js/css）
       new HtmlWebpackPlugin()
     ]
   }
   ```

   ```js
   module.exports = {
     plugins: [
       // html-webpack-plugin，功能：默认会创建一个空的HTML，自动引入打包输出的所有资源（js/css）
       // 需求：需要有结构的 html 文件
       new HtmlWebpackPlugin({
         // 复制 './src/index.html' 文件，并自动引入打包输出的所有资源（js/css）
         template: './src/index.html'
       })
     ]
   }
   ```



### 打包 img 图片资源

下载：`npm i url-loader file-loader html-loader -D`

```js
module.exports = {
  // loader 配置
  module: {
    rules: [
      // 详细 loader 配置
      {
        // 问题：默认处理不了 html 中的 img 图片
        // 处理图片资源
        test: /\.(jpg|png|gif)$/,
        // 使用 loader
        // 下载 url-loader file-loader
        loader: 'url-loader',
        options: {
          // 图片大小 小于8kb，就会被 base64 处理
          // 优点：减少请求数量（减轻服务器压力）
          // 缺点：图片体积会更大（文件请求更慢）
          limit: 8 * 1024,
          // 问题：因为 url-loader 默认使用es6模块化解析，而 html-loader 引入图片是commonjs
          // 解析时会出问题：[object Module]
          // 解决：关闭 url-loader 的es6模块化，使用 commonjs 模块化
          esModule: false,
          // 给图片重命名
          // [hash: 10]取图片的hash的前10位
          // [ext]文件的原扩展名
          name: '[hash: 10].[ext]'
        }
      },
      {
        test: /\.html$/,
        // 下载 html-loader
        // 处理 html 文件的img图片的（负责引入 img，从而能被 url-loader 进行打包处理）
        loader: 'html-loader'
      }
    ]
  }
}
```



### 打包字体文件等

```js
module.exports = {
  module: {
    rules: [
      {
        // 打包其他资源（除了 html/js/css 以外的资源）
        // 排除的资源文件
        exclude: /\.(css|js|html)$/,
        loader: 'file-loader'
      }
    ]
  }
}
```



### 开发服务器 devServer

```js
module.exports = {
  // 开发服务器 devServer：用来 自动化（自动编译，自动打开浏览器，自动刷新浏览器等）
  // 特点：只会在内存中编译打包，不会有任何输出
  // 启动 devServer指令为：npx webpack-dev-server （npm i webpack-dev-server -D）
  devServer: {
    contentBase: resolve(__dirname, 'build'),
    // 启动 gzip 压缩
    compress: true,
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open: true
  }
}
```



## 构建环境配置

### 分离 css 文件

插件：`npm i mini-css-extract-plugin -D`

```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 创建style标签，将样式放入
          // 'style-loader',
          // 这个loader取代style-loader。作用：提取css成单独文件
          MiniCssExtractPlugin.loader,
          // 将css文件整合到js文件中
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    // 新加插件，用于分离js中css并生成单独文件
    new MiniCssExtractPlugin({
      // 对输出的文件进行重命名
      filename: 'css/built.css'
    })
  ],
  mode: 'development'
}
```



### css 兼容性处理

插件：`npm i postcss-loader postcss-preset-env -D`

作用：帮 postcss 找到 **package.json** 中 browserslist 里面的配置，通过配置加载指定的 css 兼容性样式

- `last 1 chrome version` 兼容最近的 Chrome 版本
- `>0.2%` 98%的浏览器
- `not dead` 没有废弃的

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 创建style标签，将样式放入
          // 'style-loader',
          // 这个loader取代style-loader。作用：提取css成单独文件
          MiniCssExtractPlugin.loader,
          // 将css文件整合到js文件中
          'css-loader',
          /*
          * css兼容性处理：postcss --> postcss-loader postcss-preset-env
          * 帮postcss找到 package.json 中 browserslist 里面的配置，通过配置加载指定的css兼容性样式
          */
          // 使用loader的默认配置
          //  'postcss-loader'
          // 修改loader配置
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => {
                // postcss 插件
                [require('postcss-preset-env')()]
              }
            }
          }
        ]
      }
    ]
  },
```

```json
{
  "browserslist": {
    // 开发环境 --> 设置node环境变量：process.env.NODE_ENV = development
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ],
    // 生产环境：默认是看生产环境
    "production": [">0.2%", "not dead", "not op_mini all"]
  }
}
```



### 压缩 css

插件：`npm i optimize-css-assets-webpack-plugin -D`

```js
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
plugins: [
  // 压缩css
  new OptimizeCssAssetsWebpackPlugin()
]
```



### js 语法检查 eslint

语法检查： eslint

插件：`npm i eslint-loader eslint -D`

**注意：** 只检查自己的写的源代码，第三库是不需要检查的。

设置检查规则：

- package.json 中 **eslintConfig** 中设置

  ```json
   "eslintConfig": {
    "extends": "airbnb-base"
  }
  ```

  或者在 **.eslintrc** 文件中设置

- airbnb（ES6 语法检查）--> `npm i eslint-config-airbnb-base eslint eslint-plugin-import -D`

- `// eslint-disable-next-line`（表示下一行 eslint 所有规则都失效，即下一行不进行 eslint 检查）

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          // 自动修复eslint的错误
          fix: true
        }
      }
    ]
  }
}
```



### js 兼容性处理 babel

插件：`npm i babel-loader @babel/core @babel/preset-env -D`

1. 基本 js 兼容性处理 --> **@babel/preset-env**
   问题：只能转换基本语法，如 **promise** 高级语法不能转换
2. 全部的 js 兼容性处理 --> **@babel/polyfill**
   插件：`npm i @babel/polyfill -D`
   问题：只想解决部分兼容性问题，但是将所有的兼容性代码全部引入，体积太大
3. **按需加载** js 兼容性处理：**core-js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // 预设：指示babel做怎样的兼容性处理
          presets: [
            '@babel/preset-env',
            {
              // 按需加载
              useBuiltIns: 'usage',
              // 指定 core-js 版本
              corejs: {
                version: 3
              },
              // 指定兼容性做到哪个版本浏览器
              targets: {
                chrome: '60',
                firefox: '60',
                ie: '9',
                safari: '10',
                edge: '17'
              }
            }
          ]
        }
      }
    ]
  }
}
```



### 压缩 html 和 js

- js 压缩：生产环境（production）下会自动压缩 js 代码。即设置 `webpack.config.js` 中的 mode 为：`mode: 'production'`

- html 压缩：

  ```js
  plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        // 压缩 html 代码
        minify: {
          // 移除空格
          collapseWhitespace: true,
          // 移除注释
          removeComments: true
        }
      }),
    ],
  ```



## 总结配置：

**webpack.config.js** 文件

```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

// 设置nodejs环境变量：决定使用 browserslist 的哪个环境
process.env.NODE_ENV = 'development'

// 复用 loader
const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    // 还需要在 package.json 中定义 browserslist
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => {
        [require('postcss-preset-env')()]
      }
    }
  },
]

module.exports = {
  entry: './src/js/index.js',
  ouput: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [...commonCssLoader]
      },
      {
        test: /\.less$/,
        use: [
          ...commonCssLoader,
          'less-loader'
        ]
      },
      /**
       * 正常来讲，一个文件只能被一个loader处理。
       * 当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序
       * 先执行 eslint ，再执行 babel
       */
      {
        // 在 package.json 中设置 eslintConfig --> airbnb
        test: /\.js$/,
        exclude: /node_modules/,
        // 优先执行
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'useage',
                corejs: { version: 3 },
                targets: {
                  chrome: '60',
                  firefox: '60',
                  ie: '9',
                  safari: '10',
                  edge: '17'
                }
              }
            ]
          ]
        }
      },
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          name: '[hash:10].[ext]',
          outputPath: 'img',
          esModule: false
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        exclude: /\.(js|css|less|html|jpg|png|gif)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'media'
        }
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/built.css'
    }),
    new OptimizeCssAssetsWebpackPlugin()
  ],
  mode: 'production'
}
```

**package.json** 文件：

```json
{
    "browserslist": {
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ],
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ]
  },
  "eslintConfig": {
    "extends": "airbnb-base"
  }
}
```
