// https://nuxt.com/docs/api/configuration/nuxt-config
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5'

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/sitemap'
  ],

  sitemap: {
    siteUrl: 'https://chiikawa.2fishs.com',
    // 自動探索路由
    autoLastmod: true,
    // 排除管理員路由
    exclude: ['/admin/**'],
    // 預設設定
    defaults: {
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date().toISOString()
    },
    // 自動生成路由
    urls: async () => {
      // 這裡可以加入一些固定的路由
      const staticUrls = [
        {
          url: '/',
          priority: 1.0,
          changefreq: 'daily'
        },
        {
          url: '/contribute',
          priority: 0.8,
          changefreq: 'weekly'
        },
        {
          url: '/commonSites',
          priority: 0.7,
          changefreq: 'monthly'
        }
      ]

      // 如果需要添加動態生成的圖鑑頁面，可以從 API 獲取
      // const response = await fetch('https://your-api/picdata')
      // const picData = await response.json()
      // const dynamicUrls = picData.map(pic => ({
      //   url: `/detail/${pic._id}`,
      //   priority: 0.6,
      //   changefreq: 'weekly'
      // }))

      // return [...staticUrls, ...dynamicUrls]
      return staticUrls
    }
  },

  plugins: ['~/utils/i18n.ts'],

  imports: {
    dirs: [
      // 掃描 composables 目錄頂層
      'composables',
      // 掃描深度一層的特定檔案
      'composables/*/index.{ts,js,mjs,mts}',
      // 掃描整個 composables 目錄下的檔案
      'composables/**',
      'stores'
    ]
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [ckeditor5({ theme: require.resolve('@ckeditor/ckeditor5-theme-lark') })]
  },
  app: {
    head: {
      meta: [
        {
          name: 'google-site-verification',
          content: 'ezYJ7T0oDpkV9XX_IDz-OqV3T187C5qDx_QGGu4igJo'
        }
      ]
    }
  },

  compatibilityDate: '2025-02-12'
})
