import { defineConfig } from "vitepress";

export default defineConfig({
  title: "博客",
  description: "下一代博客",
  lang: "zh-CN",

  lastUpdated: true,

  head: [
    // 注入到当前页面的 HTML <head> 中的标签
    // ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],

    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
  ],

  vue: {
    reactivityTransform: true,
  },

  themeConfig: {
    logo: "/logo.svg",

    siteTitle: "博客",
    socialLinks: [
      { icon: "github", link: "https://github.com/WalkAlone0325" },
      // 此处无法解析 svg 图标
      // {
      //   icon: 'discord',
      //   link: 'https://juejin.cn/user/712139265285437',
      // },
    ],

    nav: [
      { text: "工具篇", link: "/util/index", activeMatch: "/util/" },
      { text: "Guide", link: "/guide/index", activeMatch: "/guide/" },
      { text: "Configs", link: "/configs/index", activeMatch: "/config/" },
      { text: "About", link: "/about/index", activeMatch: "/about/" },
    ],

    sidebar: {
      "/util/": [
        {
          text: "开始",
          collapsible: true,
          items: [
            { text: "指引", link: "/util/index" },
            { text: "VSCode 设置", link: "/util/vscsetting" },
          ],
        },
        {
          text: "Mac",
          collapsible: true,
          items: [{ text: "Mac 开发环境配置", link: "/util/mac-utils" }],
        },
      ],
    },
  },
});
