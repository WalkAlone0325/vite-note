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

  vue: {
    reactivityTransform: true
  },

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
      {
        text: 'TypeScript',
        link: '/typescript/index',
        activeMatch: '/typescript/'
      },
      { text: '配置', link: '/configs/index', activeMatch: '/config/' },
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
            { text: '东野圭吾：《毕业》', link: '/readFeel/毕业' }
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
        {
          text: 'Vue3 API',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '合集', link: '/source/vue3-api/' },
            { text: '@vue/reactivity', link: '/source/vue3-api/reactivity' },
            // { text: './apiComputed', link: '/source/vue3-api/apiComputed' },
            // { text: './apiWatch', link: '/source/vue3-api/apiWatch' }
          ]
        },
        {
          text: 'Vue3 源码解析',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '总体流程', link: '/source/vue3/vue-source' },
            { text: '简单实现渲染器', link: '/source/vue3/compiler' }
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
        // {
        //   text: 'Element Plus',
        //   collapsible: true,
        //   collapsed: true,
        //   items: [
        //     { text: 'dialog', link: '/source/element-plus/dialog' },
        //     { text: 'overlay', link: '/source/element-plus/overlay' }
        //   ]
        // },
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
    }
  }
})
