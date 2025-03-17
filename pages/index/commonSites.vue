<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { seriesList, categoryList, roleList, imageTypeList } from '~/constants/yikawa'

const { t } = useI18n()

/**
 * 網站列表
 * 吉伊卡哇官方 https://chiikawamarket.jp/zh-hant
 * 吉伊卡哇官方_川越本舖 https://chiikawamogumogu.shop/
 * 長野角色 | ナガノマーケット公式通販 https://nagano-market.jp/zh-hant
 * Chiikawa鑑定指南 https://chiimeh2kawa.wixsite.com/realorfake?%E8%A7%92%E8%89%B2=All
 * 舊版自嘲熊鑑定站 https://chiimeh2kawa.wixsite.com/naganobearrof
 * 吉伊卡哇圖鑑 https://www.chiikawatribe.com/collection/
 * 官方整合資訊網 https://chiikawa-info.jp/
    新品到專門店，連過去既活動都有
    去日本專門店前必定要留意
 */

const sites = [
  {
    key: 'chiikawa_market', // 吉伊卡哇官方
    url: 'https://chiikawamarket.jp/zh-hant'
  },
  {
    key: 'chiikawa_market_mogumogu', // 吉伊卡哇官方_川越本舖
    url: 'https://chiikawamogumogu.shop/'
  },
  {
    key: 'nagano_market', // 長野角色 | ナガノマーケット公式通販
    url: 'https://nagano-market.jp/zh-hant'
  },
  {
    key: 'chiikawa_identification', // Chiikawa鑑定指南
    url: 'https://chiimeh2kawa.wixsite.com/realorfake?%E8%A7%92%E8%89%B2=All'
  },
  {
    key: 'naganobearrof', // 舊版自嘲熊鑑定站
    url: 'https://chiimeh2kawa.wixsite.com/naganobearrof'
  },
  {
    key: 'chiikawa_tribe', // 吉伊卡哇圖鑑
    url: 'https://www.chiikawatribe.com/collection/'
  },
  {
    key: 'chiikawa_info', // 官方整合資訊網
    url: 'https://chiikawa-info.jp/'
  }
]
</script>
<template>
  <div class="mx-auto max-w-4xl p-4">
    <h1 class="mb-8 text-2xl font-bold">
      {{ t('title.common_sites') }}
    </h1>

    <div class="grid gap-6 md:grid-cols-2">
      <div
        v-for="site in sites"
        :key="site.key"
        class="cus-hover flex flex-col rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md"
      >
        <h2 class="mb-2 text-xl font-bold">
          {{ t(`common_sites_list.sites.${site.key}.name`) }}
        </h2>
        <p class="mb-4 text-gray-600">
          {{ t(`common_sites_list.sites.${site.key}.description`) }}
        </p>
        <a
          :href="site.url"
          target="_blank"
          rel="noopener noreferrer"
          class="custom-btn-secondary mt-auto self-end"
        >
          {{ t('common_sites_list.goto_button') }}
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 如果需要額外的樣式可以在這裡添加 */
</style>
