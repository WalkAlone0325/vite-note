# Vite 源码包之 create-vite

项目地址：[https://github.com/WalkAlone0325/cli](https://github.com/WalkAlone0325/cli)

> `create-vite` 创建模版过程解析

## 理解和思路

我们使用 `vite` 创建项目 的时候使用 `pnpm create vite` 来进行初始化，并经历如下流程：

![create-vue](/create-vue.png)

1. `pnpm create vite`
2. 输入项目名称：`vue-project`
3. 选择框架：`Vue`
4. 选择变体（语言、自定义的模版等）：`TypeScript`
5. 在对应的目标文件夹下生成 `脚手架项目模版`
6. 提示完成，并给出对应的提示命令

## 核心包

1. `prompts` （实现命令行交互式界面）
2. `minimist` （命令行参数解析工具）
3. `kolorist` (颜色工具)
4. `unbuild` （打包工具）
5. `esno` （基于 `esbuild` 的 `TS/ESNext` 的 `Node.js` 运行时，直接运行 `.ts文件`）

## 实现

### 基础配置

```ts
// 获取命令行的解析参数 
const argv = minimist<{
  t?: string // --t
  template?: string // --template
}>(process.argv.slice(2), { string: ['_'] })

// 获取当前路径
const cwd = process.cwd()

type ColorFunc = (str: string | number) => string

type Framework = {
  name: string
  display: string
  color: ColorFunc
  variants: FrameworkVariant[]
}

type FrameworkVariant = {
  name: string
  display: string
  color: ColorFunc
  customCommand?: string
}

// 模版
const FRAMEWORKS: Framework[] = [
  {
    name: 'vue',
    display: 'Vue',
    color: green,
    variants: [
      {
        name: 'vue',
        display: 'JavaScript',
        color: yellow
      },
      {
        name: 'vue-ts',
        display: 'TypeScript',
        color: blue
      }
    ]
  }
]

// ['vue', 'vue-ts'] 获取对应的模版名称，方便查找相应模版
const TEMPLATES = FRAMEWORKS.map(
  (f) => (f.variants && f.variants.map((v) => v.name)) || [f.name]
).reduce((a, b) => a.concat(b), [])

// 对平台不同，解析不一样的 . 行为处理
const renameFiles: Record<string, string | undefined> = {
  _gitignore: '.gitignore'
}

// 定义 默认的目标文件夹名称
const defaultTargetDir = 'mine-cli-project'
```

### 核心方法

1. 定义交互执行命令：`输入项目名称` => `选择框架` => `选择模版`
2. 自动写入模版
3. 写入完成提示信息

```ts
async function init() {
  const argTargetDir = formatTargetDir(argv._[0])
  // --template / --t xxx => xxx
  const argTemplate = argv.template || argv.t

  // 项目名称
  let targetDir = argTargetDir || defaultTargetDir

  // 如果项目名称写的是 . ，则变为输入命令的目录
  const getProjectName = () =>
    targetDir === '.' ? path.basename(path.resolve()) : targetDir

  // 交互完成后的返回的信息
  let result: prompts.Answers<
    'projectName' | 'overwrite' | 'packageName' | 'framework' | 'variant'
  >
  
  try {
    // 实现交互
  }
  catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }
}

// 运行和抛出错误信息
init().catch(e => {
  console.error(e)
})
```

### 实现交互

```ts
result = await prompts(
  [
    {
      type: argTargetDir ? null : 'text',
      name: 'projectName',
      // message: reset('Project name:'),
      message: reset('请输入项目名称：'),
      initial: defaultTargetDir,
      // 对输入的项目名称进行规范
      onState: (state) => {
        targetDir = formatTargetDir(state.value) || defaultTargetDir
      }
    },
    // 判断输入，为 . ，判断是否为空路径，是否覆盖，否则直接取输入为项目名称
    {
      type: () =>
        !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
      name: 'overwrite',
      message: () =>
        (targetDir === '.'
          ? 'Current directory'
          : // : `Target directory "${targetDir}"`) +
            `目标文件夹 "${targetDir}"`) +
        // ` is not empty. Remove existing files and continue?`
        ` 不是空文件夹。请选择覆盖或退出。`
    },
    // 如果选择不覆盖，直接退出界面，取消操作
    {
      type: (_, { overwrite }: { overwrite: boolean }) => {
        if (overwrite === false) {
          // 不覆盖直接 取消操作
          // throw new Error(red('✖') + 'Operation cancelled')
          throw new Error(red('✖') + '取消操作')
        }
        return null
      },
      name: 'overwriteChecker'
    },
    // 检测包名称
    {
      type: () => (isVaildPackageName(getProjectName()) ? null : 'text'),
      name: 'packageName',
      message: reset('Package name:'),
      inactive: () => toValidPackageName(getProjectName()),
      // 检测是否为有效的包名称
      validate: (dir) =>
        isVaildPackageName(dir) || 'Invalid package.json name'
    },
    // 第一层 选择的框架，如果是选择的框架模版，直接跳过，否则是 select，继续选择 框架模版
    {
      type:
        argTemplate && TEMPLATES.includes(argTemplate) ? null : 'select',
      name: 'framework',
      // 如果选择的模版不在规定发里面，则模版不是有效的，请从下面选择一个框架
      message:
        typeof argTemplate === 'string' && !TEMPLATES.includes(argTemplate)
          ? reset(
              // `"${argTemplate}" isn't a valid template. Please choose from below: `
              `"${argTemplate}" 不是一个有效的模版，请选择如下： `
            )
          : // : reset('Select a framework:'),
            reset('请选择一个框架：'),
      initial: 0,
      choices: FRAMEWORKS.map((framework) => {
        const frameworkColor = framework.color
        return {
          title: frameworkColor(framework.display || framework.name),
          value: framework
        }
      })
    },
    // 第二层
    {
      type: (framework: Framework) =>
        framework && framework.variants ? 'select' : null,
      name: 'variant',
      // message: reset('Select a variant'),
      message: reset('请选择具体模版：'),
      choices: (framework: Framework) =>
        framework.variants.map((variant) => {
          const variantColor = variant.color
          return {
            title: variantColor(variant.display || variant.name),
            value: variant.name
          }
        })
    }
  ],
  {
    // 取消操作
    onCancel: () => {
      // throw new Error(red('✖') + ' Operation cancelled')
      throw new Error(red('✖') + '取消操作')
    }
  }
)
```

### 写入模版

1. 拿到命令交互后的结果信息
2. 根据 `overwrite` 属性 `清空` 或 `创建` 目标文件夹
3. 从结果信息里确认对应的模版，并找到模版所在的文件夹
4. 开始写入模版
   1. 递归写入文件和创建文件夹
   2. 单独处理 `package.json`，转为 `json` 格式，修改 `name`、`version` 等相关信息
   3. 获取环境使用的包管理工具
5. 写入完成，根据包管理器提示信息

```ts
// 拿到命令交互后返回的结果信息
const { framework, overwrite, packageName, variant } = result

// 根路径
const root = path.join(cwd, targetDir)

// 清空或者创建文件夹
if (overwrite) {
  // 强制清空文件夹
  emptyDir(root)
} else if (!fs.existsSync(root)) {
  // recursive 递归的创建文件夹
  fs.mkdirSync(root, { recursive: true })
}

// 确定模版
const template: string = variant || framework || argTemplate

// 获取包管理信息
const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
// 获取包管理器名称
const pkgManager = pkgInfo ? pkgInfo.name : 'npm'

// 脚手架项目在 root 写入模版开始
console.log(`\n正在写入模版到 ${root} \n请稍等...`)

// 找到放置模版文件夹的路径
const templateDir = path.resolve(
  fileURLToPath(import.meta.url),
  '../../templates',
  `template-${template}`
)

// 写入方法
const write = (file: string, content?: string) => {
  const targetPath = path.join(root, renameFiles[file] ?? file)
  if (content) {
    fs.writeFileSync(targetPath, content)
  } else {
    copy(path.join(templateDir, file), targetPath)
  }
}

// 写入文件 此处过滤掉 package.json 是做单独处理：修改name等
const files = fs.readdirSync(templateDir)
for (const file of files.filter((f) => f !== 'package.json')) {
  write(file)
}

// 将 package.json 的内容转成 json 
const pkg = JSON.parse(
  fs.readFileSync(path.join(templateDir, 'package.json'), 'utf-8')
)

// 更改 package.json 的 name
pkg.name = packageName || getProjectName()
// 将 package.json 的 name 改为 项目名称
write('package.json', JSON.stringify(pkg, null, 2))

// 写入完成后的提示信息
console.log(`\n写入完成. 请运行如下命令：\n`)

if (root !== cwd) {
  console.log(lightGreen(`   cd ${path.relative(cwd, root)}`))
}
switch (pkgManager) {
  case 'yarn':
    console.log(lightGreen('   yarn'))
    console.log(lightGreen('   yarn dev'))
    break
  default:
    console.log(lightGreen(`   ${pkgManager} install`))
    console.log(lightGreen(`   ${pkgManager} run dev`))
    break
}
console.log()
```

## 工具函数

```ts
// 规范处理文件夹名称
function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, '')
}

// 复制模版
function copy(src: string, dest: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

// 复制文件夹
function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

// 是否为合规发 packageName
function isVaildPackageName(projectName: string) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  )
}

// 转换为合规的 packageName
function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
}

// 判断是否是空文件夹
function isEmpty(path: string) {
  const files = fs.readdirSync(path)
  return files.length === 0 || (files.length === 1 && files[0] === '.git')
}

// 强制删除成为空文件夹
function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') {
      continue
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}

// 获取使用的包管理工具和版本号
function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1]
  }
}

```
