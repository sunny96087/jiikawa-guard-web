<script setup>
useHead({
  title: '新吉伊卡哇鑒定站',
  // titleTemplate: (title) => (title ? `${title} - 新版吉伊卡哇鑒定網站` : '新版吉伊卡哇鑒定網站'),
  htmlAttrs: {
    lang: 'zh-TW'
  },
  meta: [
    {
      name: 'description',
      content:
        '不專業的吉伊卡哇(ちいかわ)商品真偽鑑定資訊網站，提供最新的真偽辨識資訊，協助收藏者避免購入仿冒品。'
    },
    {
      name: 'keywords',
      content:
        'ちいかわ,chiikawa,吉伊卡哇,哈吉瓦雷,ハチワレ,hachiware,兔子,うさぎ,usagi,松鼠,モモンガ,momonga,栗子饅頭,くりまんじゅう,kurimanju,海獺,ラッコ,rakko,獅子像,シーサー,shisa,螃蟹,カニ,kani,大強,だいすとろんぐ,daistrong,頌,そう,sou,奇美拉,キメラ,chimera,鎧甲人,よろいさん,yoroisan,獨角仙,カブトムシ,kabutomushi,妖精,ようせい,yousei,星星,ほし,hoshi,長野,nagano,動畫,アニメ,anime,漫畫,マンガ,manga,周邊,グッズ,merchandise,玩偶,ぬいぐるみ,plush,真偽鑑定,真贋鑑定,authentication,正品,本物,genuine,仿冒品,偽物,counterfeit,一番くじ,ichiban kuji,サンリオ,sanrio,読売ジャイアンツ,yomiuri giants'
    },
    { name: 'twitter:title', content: '吉伊卡哇真偽鑑定網' },
    {
      name: 'twitter:description',
      content:
        '不專業的吉伊卡哇(ちいかわ)商品真偽鑑定資訊網站，提供最新的真偽辨識資訊，協助收藏者避免購入仿冒品。'
    },
    {
      name: 'author',
      content: 'Chiikawa Authentication Team'
    },
    {
      name: 'robots',
      content: 'index, follow'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    },
    // { name: 'twitter:image', content: 'https://i.imgur.com/AVNujNC.png' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: '吉伊卡哇鑑定' },
    {
      name: 'google-site-verification',
      content: 'ezYJ7T0oDpkV9XX_IDz-OqV3T187C5qDx_QGGu4igJo'
    },
    { property: 'og:image', content: 'https://r2.2fishs.com/images/twitter.webp' }
  ],
  link: [
    {
      rel: 'icon',
      href: '/jii-logo.png'
    },
    {
      rel: 'canonical',
      href: 'https://chiikawa.2fishs.com'
    },
    {
      rel: 'alternate',
      hreflang: 'zh-TW',
      href: 'https://chiikawa.2fishs.com'
    }
  ]
})

// 添加 SEO 搜尋引擎最佳化相關的 Meta Tags
useSeoMeta({
  description:
    '不專業的吉伊卡哇(ちいかわ)商品真偽鑑定資訊網站，提供最新的真偽辨識資訊，協助收藏者避免購入仿冒品。',
  ogTitle: '吉伊卡哇真偽鑑定網',
  ogDescription:
    '不專業的吉伊卡哇(ちいかわ)商品真偽鑑定資訊網站，提供最新的真偽辨識資訊，協助收藏者避免購入仿冒品。',
  ogUrl: 'https://chiikawa.2fishs.com/',
  ogType: 'website',
  ogSiteName: '吉伊卡哇鑑定',
  twitterCard: 'summary_large_image',
  twitterTitle: '吉伊卡哇真偽鑑定網',
  twitterDescription:
    '不專業的吉伊卡哇(ちいかわ)商品真偽鑑定資訊網站，提供最新的真偽辨識資訊，協助收藏者避免購入仿冒品。',
  twitterImage: 'https://r2.2fishs.com/images/twitter.webp',
  ogLocale: 'zh_TW',
  ogLocaleAlternate: ['ja_JP', 'en_US'],
  articleAuthor: '2魚',
  articlePublishedTime: '2025-03-16',
  articleModifiedTime: new Date().toISOString(),
  ogImage: [
    {
      url: 'https://r2.2fishs.com/images/twitter.webp',
      width: 1200,
      height: 630,
      alt: '吉伊卡哇鑑定網站封面圖'
    }
  ]
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
