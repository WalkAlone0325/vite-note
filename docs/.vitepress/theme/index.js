import Layout from './components/Layout.vue'
import NotFound from './components/NotFound.vue'
import DefaultTheme from 'vitepress/theme'

export default {
  ...DefaultTheme,
  Layout,
  NotFound,
  enhanceApp({ app, router, siteData }) {},
}
