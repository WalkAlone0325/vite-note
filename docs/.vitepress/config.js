import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '博客',
  description: '下一代博客',
  lang: 'zh-CN',

  lastUpdated: true,

  head: [
    // 注入到当前页面的 HTML <head> 中的标签
    // ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],

    // ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.ico' }]
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/home.jpg' }]
  ],

  vue: {},

  themeConfig: {
    logo: '/home.jpg',

    siteTitle: 'Nebula 的博客',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/WalkAlone0325' }
      // 此处无法解析 svg 图标
      // {
      //   icon: 'discord',
      //   link: 'https://juejin.cn/user/712139265285437',
      // },
    ],

    nav: [
      { text: '文章', link: '/article/index', activeMatch: '/article/' },
      { text: '读后感', link: '/readFeel/index', activeMatch: '/readFeel/' },
      { text: '框架相关', link: '/frame/index', activeMatch: '/frame/' },
      { text: '工具篇', link: '/util/index', activeMatch: '/util/' },
      { text: '源码', link: '/source/index', activeMatch: '/source/' },
      // { text: 'VueUse', link: '/vueuse/index', activeMatch: '/vueuse/' },
      {
        text: 'TypeScript',
        link: '/typescript/index',
        activeMatch: '/typescript/'
      },
      { text: '随记', link: '/configs/index', activeMatch: '/config/' },
      { text: '关于', link: '/about/index', activeMatch: '/about/' }
    ],

    sidebar: {
      '/article/': [
        {
          items: [
            { text: '归档', link: '/article/index' },

            { text: 'HTTP 状态码全解析', link: '/article/http-status' },
            { text: '事件 Event', link: '/article/event' },
            { text: '文件 blob', link: '/article/blob' },
            { text: '网络 network', link: '/article/network' },
            { text: '期约 Promise', link: '/article/promise' },
            { text: '后台管理系统相关整理', link: '/article/后台管理' },
            { text: 'webpack配置一', link: '/article/webpack配置一' },
            { text: 'webpack配置二', link: '/article/webpack配置二' }
          ]
        }
      ],
      '/readFeel': [
        {
          items: [
            { text: '随记', link: '/readFeel/随记' },
            { text: '东野圭吾：《毕业》', link: '/readFeel/毕业' },
            { text: '东野圭吾：《红手指》', link: '/readFeel/红手指' },
            { text: '东野圭吾：《解忧杂货店》', link: '/readFeel/解忧杂货店' },
            { text: '2022 年度总结', link: '/readFeel/2022年度总结' },
            { text: '漫记', link: '/readFeel/漫记' },
            { text: '2023 年度总结', link: '/readFeel/2023年度总结' },
            { text: '2025 年', link: '/readFeel/2025年' },
            { text: '莫言：《不被大风吹倒》', link: '/readFeel/不被大风吹倒' },
          ]
        }
      ],
      '/frame/': [
        // {
        //   text: 'CI/CD',
        //   collapsible: true,
        //   items: [{ text: '教程', link: '/frame/cicd/index' }]
        // },
        {
          text: 'nginx',
          collapsible: true,
          items: [
            { text: '教程', link: '/frame/nginx/learn' },
            { text: '配置解析', link: '/frame/nginx/nginx' },
            { text: '常用配置', link: '/frame/nginx/config' }
          ]
        },
        {
          text: 'Vue',
          collapsible: true,
          items: [
            { text: '面试相关', link: '/frame/vue/interview' },
            { text: '项目模版搭建', link: '/frame/vue/init' },
            { text: '大屏适配方案', link: '/frame/vue/vue-fit' },
            { text: '同构渲染', link: '/frame/vue/hydration' }
          ]
        },
        {
          text: '面试相关',
          collapsible: true,
          items: [
            { text: 'HR面试', link: '/frame/interview/HR' },
            { text: '面试', link: '/frame/interview/面试' },
            { text: 'js 面试题', link: '/frame/interview/js' },
            { text: 'js2 面试题', link: '/frame/interview/js2' },
            { text: 'css 面试题', link: '/frame/interview/css' },
            { text: 'http 面试题', link: '/frame/interview/http' },
            { text: '优化 面试题', link: '/frame/interview/optimization' }
          ]
        }
      ],
      '/util/': [
        {
          text: '开始',
          collapsible: true,
          items: [
            { text: '合集', link: '/util/total' },
            { text: 'VSCode 设置', link: '/util/vscsetting' }
          ]
        },
        {
          text: 'Mac',
          collapsible: true,
          items: [
            { text: 'Mac 开发环境配置', link: '/util/mac-utils' },
            { text: 'Linux 常用命令', link: '/util/linux' },
            { text: 'Linux 文件结构', link: '/util/file-system' },
            { text: 'Vi 常用命令', link: '/util/vi' },
            { text: 'Java 开发环境配置', link: '/util/java' }
          ]
        }
      ],
      '/source/': [
        // {
        //   text: 'React API',
        //   collapsed: true,
        //   collapsible: true,
        //   items: [
        //     { text: '合集', link: '/source/react-api/' },
        //     { text: 'Component', link: '/source/react-api/Component' },
        //     { text: '合集', link: '/source/react-api/' }
        //   ]
        // },
        {
          text: 'Vue3 API',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '合集', link: '/source/vue3-api/' },
            { text: '@vue/reactivity', link: '/source/vue3-api/reactivity' },
            { text: './vnode', link: '/source/vue3-api/vnode' },
            { text: './apiInject', link: '/source/vue3-api/apiInject' },
            {
              text: 'nextTick defineComponent',
              link: '/source/vue3-api/basic'
            },
            {
              text: './apiSetupHelpers',
              link: '/source/vue3-api/apiSetupHelpers'
            },
            { text: './component/Teleport', link: '/source/vue3-api/teleport' },
            { text: './component/Suspense', link: '/source/vue3-api/suspense' },
            // { text: './apiComputed', link: '/source/vue3-api/apiComputed' },
            // { text: './apiWatch', link: '/source/vue3-api/apiWatch' }
            { text: 'useTemplateRef', link: '/source/vue3-api/useTemplateRef' }
          ]
        },
        {
          text: 'Vue3 源码解析',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '总体流程', link: '/source/vue3/vue-source' },
            { text: '简单实现渲染器', link: '/source/vue3/compiler' },
            { text: 'runtime', link: '/source/vue3/runtime' },
            { text: 'compile', link: '/source/vue3/compile' },
            { text: 'reactivity', link: '/source/vue3/reactivity' }
          ]
        },
        {
          text: 'Vue3 相关生态库',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Pinia', link: '/source/vue-about/pinia/' },
            { text: 'Router', link: '/source/vue-about/router/' },
            { text: 'Vite', link: '/source/vue-about/vite/' },
            {
              text: 'Vite create-vite',
              link: '/source/vue-about/vite/create-vite'
            }
          ]
        },
        {
          text: 'Element Plus',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'dialog', link: '/source/element-plus/dialog' },
            { text: 'overlay', link: '/source/element-plus/overlay' },
            { text: 'drawer', link: '/source/element-plus/drawer' },
            { text: 'card', link: '/source/element-plus/card' }
          ]
        },
        {
          text: 'vben-admin 源码解析',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '文件下载', link: '/source/vben-admin/download' },
            // { text: '页面水印', link: '/source/vben-admin/watermark' },
            { text: '错误处理', link: '/source/vben-admin/error-handler' }
          ]
        }
      ],
      '/typescript/': [
        {
          text: 'TypeScript',
          collapsible: true,
          items: [
            { text: '基础知识', link: '/typescript/basic' },
            { text: '数据类型', link: '/typescript/datatype' },
            { text: '高级类型', link: '/typescript/hightype' }
          ]
        }
      ]
      // '/vueuse/': [
      //   {
      //     text: 'VueUse',
      //     collapsed: false,
      //     collapsible: true,
      //     items: [{ text: 'state', link: '/vueuse/state' }]
      //   }
      // ]
    }
  }
})
