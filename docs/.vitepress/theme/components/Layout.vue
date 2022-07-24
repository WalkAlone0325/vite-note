<script setup>
import BackGround from './BackGround.vue'
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #layout-top>
      <BackGround />
    </template>
    <!-- <template #aside-ads-before></template> -->
  </Layout>
</template>
