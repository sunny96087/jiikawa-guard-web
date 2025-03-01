<script setup>
useHead({
  title: '新版吉伊卡哇鑒定網站',
  // titleTemplate: (title) => (title ? `${title} - 新版吉伊卡哇鑒定網站` : '新版吉伊卡哇鑒定網站'),
  htmlAttrs: {
    lang: 'zh-TW'
  },
  meta: [
    {
      name: 'description',
      content:
        '不專業的吉伊卡哇商品真偽鑑定資訊網站，提供最新的真偽辨識資訊，協助收藏者避免購入仿冒品。'
    },
    { name: 'twitter:title', content: '吉伊卡哇真偽鑑定網' },
    {
      name: 'twitter:description',
      content:
        '不專業的吉伊卡哇商品真偽鑑定資訊網站，提供最新的真偽辨識資訊，協助收藏者避免購入仿冒品。'
    },
    // { name: 'twitter:image', content: 'https://i.imgur.com/AVNujNC.png' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: '吉伊卡哇鑑定' },
    {
      name: 'google-site-verification',
      content: 'q3j8Fywtb4CR5wt7ksjQlMPHXEPnepbCW3tmO_dIMGQ'
    }
  ],
  link: [
    {
      rel: 'icon',
      href: '/post.png'
    }
  ]
})

// 添加 SEO 搜尋引擎最佳化相關的 Meta Tags
useSeoMeta({
  description:
    '不專業的吉伊卡哇商品真偽鑑定資訊網站，提供最新的真偽辨識資訊，協助收藏者避免購入仿冒品。',
  ogTitle: '吉伊卡哇真偽鑑定網',
  ogDescription:
    '不專業的吉伊卡哇商品真偽鑑定資訊網站，提供最新的真偽辨識資訊，協助收藏者避免購入仿冒品。',
  ogUrl: 'https://community-web-4l2.pages.dev/',
  ogImage: 'https://i.imgur.com/AVNujNC.png',
  ogType: 'website',
  ogSiteName: '吉伊卡哇鑑定',
  twitterCard: 'summary_large_image',
  twitterTitle: '吉伊卡哇真偽鑑定網',
  twitterDescription:
    '不專業的吉伊卡哇商品真偽鑑定資訊網站，提供最新的真偽辨識資訊，協助收藏者避免購入仿冒品。',
  twitterImage: 'https://i.imgur.com/AVNujNC.png'
})
</script>
<template>
  <div>
    <NuxtPage />
    <!-- <navbar />
    <NuxtLayout>
      <Slidebar />
    </NuxtLayout> -->
    <ToastTool class="z-50" />
    <CustomDialog />
    <LoadingTool />
  </div>
</template>

<style scoped>
body {
  background: url('~/assets/images/bg.png') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
  font-family: 'Azeret Mono';
}
</style>
