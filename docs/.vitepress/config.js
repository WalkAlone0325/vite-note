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
      { text: '工具篇', link: '/util/index', activeMatch: '/util/' },
      { text: '计划', link: '/plan/index', activeMatch: '/plan/' },
      { text: '起步', link: '/guide/index', activeMatch: '/guide/' },
      { text: '配置', link: '/configs/index', activeMatch: '/config/' },
      { text: '关于', link: '/about/index', activeMatch: '/about/' }
    ],

    sidebar: {
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
            { text: 'Vi 常用命令', link: '/util/vi' }
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
      ]
    }
  }
})
