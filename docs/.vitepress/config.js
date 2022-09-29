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
      { text: '起步', link: '/guide/index', activeMatch: '/guide/' },
      { text: '框架相关', link: '/frame/index', activeMatch: '/frame/' },
      { text: '工具篇', link: '/util/index', activeMatch: '/util/' },
      { text: '计划', link: '/plan/index', activeMatch: '/plan/' },
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
      '/frame/': [
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
            { text: '项目模版搭建', link: '/frame/vue/init' }
          ]
        },
        {
          text: '面试相关',
          collapsible: true,
          items: [
            { text: 'js 面试题', link: '/frame/interview/js' },
            { text: 'js2 面试题', link: '/frame/interview/js2' },
            { text: 'css 面试题', link: '/frame/interview/css' }
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
      'guide/': [
        {
          text: '开始',
          collapsible: true,
          items: [
            { text: '起步', link: '/guide/quick-start' },
            { text: '配置', link: '/guide/config' }
          ]
        }
      ],
      '/source/': [
        {
          text: 'Vue3 源码解析',
          collapsible: true,
          collapsed: true,
          items: [{ text: '总体流程', link: '/source/vue-source' }]
        },
        {
          text: 'create-vite 源码解析',
          collapsible: true,
          collapsed: true,
          items: [{ text: '解析', link: '/source/create-vite' }]
        },
        {
          text: 'vben-admin 源码解析',
          collapsible: true,
          collapsed: true,  
          items: [{ text: '文件下载', link: '/source/vben-admin/download' }]
        },
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
