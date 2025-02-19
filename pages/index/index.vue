<!-- 全體動態牆 -->
<script setup lang="ts">
import type { apiResponse } from '~/models'
import { APIStore } from '~/store/apiService'
const store = APIStore()
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

import { showToast, openDialog, showLoading, hideLoading } from '~/store/eventBus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const currentKeyword = ref('') // 關鍵字

/* =============== 系列 =============== */
const currentYikawaSeries = ref('all') // 系列

const yikawaSeriesList = computed(() => [
  {
    id: 0,
    key: 'all',
    name: t('yikawa_series.all')
  },
  {
    id: 1,
    key: 'yomiuri_giants',
    name: t('yikawa_series.yomiuri_giants')
  },
  {
    id: 2,
    key: 'soft_plush',
    name: t('yikawa_series.soft_plush')
  },
  {
    id: 3,
    key: 'cafe',
    name: t('yikawa_series.cafe')
  },
  {
    id: 4,
    key: 'chiikawa_land',
    name: t('yikawa_series.chiikawa_land')
  },
  {
    id: 5,
    key: 'mogumogu',
    name: t('yikawa_series.mogumogu')
  },
  {
    id: 6,
    key: 'nagano_market',
    name: t('yikawa_series.nagano_market')
  },
  {
    id: 7,
    key: 'ichiban_kuji',
    name: t('yikawa_series.ichiban_kuji')
  },
  {
    id: 8,
    key: 'rairai_dining',
    name: t('yikawa_series.rairai_dining')
  },
  {
    id: 9,
    key: 'winter_scarf',
    name: t('yikawa_series.winter_scarf')
  },
  {
    id: 10,
    key: 'outing',
    name: t('yikawa_series.outing')
  },
  {
    id: 11,
    key: 'basic',
    name: t('yikawa_series.basic')
  },
  {
    id: 12,
    key: 'sushi',
    name: t('yikawa_series.sushi')
  },
  {
    id: 13,
    key: 'angel_devil',
    name: t('yikawa_series.angel_devil')
  },
  {
    id: 14,
    key: 'parallel_world',
    name: t('yikawa_series.parallel_world')
  },
  {
    id: 15,
    key: 'hero_collab',
    name: t('yikawa_series.hero_collab')
  },
  {
    id: 16,
    key: 'travel',
    name: t('yikawa_series.travel')
  },
  {
    id: 17,
    key: 'tokyo_station',
    name: t('yikawa_series.tokyo_station')
  },
  {
    id: 18,
    key: 'forest_mushroom',
    name: t('yikawa_series.forest_mushroom')
  },
  {
    id: 19,
    key: 'fluffy_grass',
    name: t('yikawa_series.fluffy_grass')
  },
  {
    id: 20,
    key: 'aquarium',
    name: t('yikawa_series.aquarium')
  },
  {
    id: 21,
    key: 'unspecified',
    name: t('yikawa_series.unspecified')
  },
  {
    id: 22,
    key: 'birthday',
    name: t('yikawa_series.birthday')
  },
  {
    id: 23,
    key: 'pajama_party',
    name: t('yikawa_series.pajama_party')
  },
  {
    id: 24,
    key: 'christmas',
    name: t('yikawa_series.christmas')
  },
  {
    id: 25,
    key: 'halloween',
    name: t('yikawa_series.halloween')
  },
  {
    id: 26,
    key: 'express_delivery',
    name: t('yikawa_series.express_delivery')
  },
  {
    id: 27,
    key: 'amusement_park',
    name: t('yikawa_series.amusement_park')
  },
  {
    id: 28,
    key: 'hankyu_train',
    name: t('yikawa_series.hankyu_train')
  },
  {
    id: 29,
    key: 'shisa_festival',
    name: t('yikawa_series.shisa_festival')
  },
  {
    id: 30,
    key: 'restaurant',
    name: t('yikawa_series.restaurant')
  },
  {
    id: 31,
    key: 'magical_girl',
    name: t('yikawa_series.magical_girl')
  },
  {
    id: 32,
    key: 'bakery',
    name: t('yikawa_series.bakery')
  },
  {
    id: 33,
    key: 'limited_edition',
    name: t('yikawa_series.limited_edition')
  }
])

const dropdownSeriesVisible = ref(false)

const toggleDropdown = () => {
  dropdownSeriesVisible.value = !dropdownSeriesVisible.value
}

const selectOption = (index: number) => {
  currentYikawaSeries.value = yikawaSeriesList.value[index].key
  dropdownSeriesVisible.value = false
  console.log(`currentPostType.value = ${currentPostType.value}`)
}

/**
 * 監聽 currentYikawaSeries 的變化，重取資料
 */
watch(currentYikawaSeries, () => {
  console.log(`currentYikawaSeries.value = ${currentYikawaSeries.value}`)
  loadData()
})

/* =============== 分類 =============== */
const currentYikawaCategory = ref('all') // 分類

const yikawaCategoriesList = computed(() => [
  {
    id: 0,
    key: 'all',
    name: t('yikawa_categories.all')
  },
  {
    id: 1,
    key: 'plush',
    name: t('yikawa_categories.plush')
  },
  {
    id: 2,
    key: 'keychain',
    name: t('yikawa_categories.keychain')
  },
  {
    id: 3,
    key: 'cushion',
    name: t('yikawa_categories.cushion')
  },
  {
    id: 4,
    key: 's_shape',
    name: t('yikawa_categories.s_shape')
  },
  {
    id: 5,
    key: 'tapestry',
    name: t('yikawa_categories.tapestry')
  },
  {
    id: 6,
    key: 'others',
    name: t('yikawa_categories.others')
  }
])

const dropdownCategoryVisible = ref(false)

const toggleDropdownCategory = () => {
  dropdownCategoryVisible.value = !dropdownCategoryVisible.value
}

const selectOptionCategory = (index: number) => {
  currentYikawaCategory.value = yikawaCategoriesList.value[index].key
  dropdownCategoryVisible.value = false
}

/**
 * 監聽 currentYikawaCategory 的變化，重取資料
 */
watch(currentYikawaCategory, () => {
  console.log(`currentYikawaCategory.value = ${currentYikawaCategory.value}`)
  loadData()
})

/* =============== 圖鑑列表 =============== */

/**
 * 吉伊卡哇圖鑑列表
 * 系列 series
 * 分類 category
 * 名稱 name
 * 圖片 image
 * 

 */
const yikawaList = ref([
  {
    id: 0,
    series: 'yomiuri_giants',
    category: 'plush',
    name: '吉伊卡哇',
    image: 'https://placehold.co/600x400'
  },
  {
    id: 1,
    series: 'yomiuri_giants',
    category: 'plush',
    name: '吉伊卡哇',
    image: 'https://placehold.co/600x400'
  },
  {
    id: 2,
    series: 'yomiuri_giants',
    category: 'plush',
    name: '吉伊卡哇',
    image: 'https://placehold.co/600x400'
  },
  {
    id: 3,
    series: 'yomiuri_giants',
    category: 'plush',
    name: '吉伊卡哇',
    image: 'https://placehold.co/600x400'
  }
])
async function loadData() {
  // console.log(`currentSort = ${currentSort}`)

  let data = {
    keyword: currentKeyword.value,
    series: currentYikawaSeries.value,
    category: currentYikawaCategory.value
  }
  console.log(data)

  // try {
  //   showLoading()
  //   const res = (await store.apiGetPost(data)) as apiResponse
  //   const result = res.data
  //   // console.log(`editEvent result = ${JSON.stringify(result)}`)

  //   if (result.status === 'success') {
  //     // 提示成功
  //     console.log('取得貼文成功')

  //     // 把資料放到 list
  //     postList.value = result.data
  //     // console.log(`postList = ${JSON.stringify(postList.value)}`)
  //     if (postList.value.length <= 0) {
  //       showToast('沒有相關文章，建議換個關鍵字查詢！')
  //     } else {
  //       // showToast('取得貼文成功')
  //     }
  //   } else {
  //     console.log('取得貼文失敗')
  //   }
  // } catch (e) {
  //   console.log(e)
  // } finally {
  //   hideLoading()
  // }
}

// TODO 下面是舊的

// onMounted(() => {
//   getUserData()
//   loadData()
// })
// 使用 watch 來監聽 currentPostType 的變化
// watch(currentPostType, () => {
//   loadData()
// })

// async function getUserData() {
//   try {
//     showLoading()
//     const res = await store.apiGetSpecifyUser()
//     const result = res.data
//     // console.log(`editEvent result = ${JSON.stringify(result)}`)
//     if (result.statusCode === 200) {
//       userData.value = result.data
//       likePostList.value = result.data.likedPosts
//       console.log(`likePostList = ${JSON.stringify(likePostList.value)}`)
//     } else {
//       console.log('取得使用者資料失敗')
//     }
//   } catch (e) {
//     console.log(e)
//   } finally {
//     hideLoading()
//   }
// }
</script>

<template>
  <div class="">
    <div class="flex flex-wrap gap-3">
      <!-- * 系列選擇 -->
      <div class="relative w-full sm:w-[200px]">
        <div class="custom-select" @click="toggleDropdown">
          {{ yikawaSeriesList.find((item: any) => item.key === currentYikawaSeries)?.name }}
          <Icon name="material-symbols:keyboard-arrow-down" size="26"></Icon>
        </div>
        <div class="custom-select-options" v-if="dropdownSeriesVisible">
          <div
            class="option"
            :class="{ 'option-selected': item.key === currentYikawaSeries }"
            v-for="(item, index) in yikawaSeriesList"
            :key="index"
            @click="selectOption(index)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>

      <!-- * 分類選擇 -->
      <div class="relative w-full sm:w-[200px]">
        <div class="custom-select" @click="toggleDropdownCategory">
          {{ yikawaCategoriesList.find((item: any) => item.key === currentYikawaCategory)?.name }}
          <Icon name="material-symbols:keyboard-arrow-down" size="26"></Icon>
        </div>
        <div class="custom-select-options" v-if="dropdownCategoryVisible">
          <div
            class="option"
            :class="{ 'option-selected': item.key === currentYikawaCategory }"
            v-for="(item, index) in yikawaCategoriesList"
            :key="index"
            @click="selectOptionCategory(index)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>

      <!-- * 關鍵字查詢 -->
      <div class="custom-search-input grow">
        <input
          type="text"
          placeholder="搜尋貼文"
          v-model="currentKeyword"
          @keyup.enter="loadData"
        />
        <button @click="loadData">
          <Icon name="material-symbols:search" size="28"></Icon>
        </button>
      </div>
    </div>

    <!-- * 圖鑑列表 -->
    <div class="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      <div class="card" v-for="item in yikawaList" :key="item.id">
        <div class="card-body">
          <div><img :src="item.image" :alt="item.name" class="pic-auto" /></div>
          <h5 class="card-title">{{ item.name }}</h5>
          <span class="card-text">{{ item.series }}</span>
          <span class="card-text">・</span>
          <span class="card-text">{{ item.category }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.liked {
  /* 點讚後的樣式 */
  background-color: #007bff;
  color: white;
}
</style>
