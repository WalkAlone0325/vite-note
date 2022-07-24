import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '博客',
  description: '下一代博客',
  lang: 'zh-CN',

  lastUpdated: true,

  head: [
    // 注入到当前页面的 HTML <head> 中的标签
    // ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],

    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],

  vue: {
    reactivityTransform: true,
  },

  themeConfig: {
    logo: '/logo.svg',

    siteTitle: '博客',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/WalkAlone0325' },
      // 此处无法解析 svg 图标
      // {
      //   icon: 'discord',
      //   link: 'https://juejin.cn/user/712139265285437',
      // },
    ],

    nav: [
      { text: '工具篇', link: '/util/index', activeMatch: '/util/' },
      { text: 'Guide', link: '/guide/index', activeMatch: '/guide/' },
      { text: 'Configs', link: '/configs/index', activeMatch: '/config/' },
    ],

    sidebar: {
      '/util/': [
        {
          text: '指引',
          collapsible: true,
          items: [
            { text: '合集', link: '/util/total' },
            { text: '合集', link: '/util/total' },
            { text: '合集', link: '/util/total' },
          ],
        },
        {
          text: 'Mac',
          collapsible: true,
          items: [{ text: 'Mac 开发环境配置', link: '/util/mac-utils' }],
        },
      ],
    },
  },
})
