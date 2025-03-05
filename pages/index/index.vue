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
import { seriesList, categoryList } from '~/constants/yikawa'

const { t } = useI18n()

const currentKeyword = ref('') // 關鍵字

/* =============== 角色 =============== */
const currentRole = ref((route.query.keyword as string) || 'all') // 從 URL 獲取 role 參數，預設為 'all'

// 監聽 route.query.role 的變化
watch(
  () => route.query.keyword,
  (newRole) => {
    if (newRole) {
      currentRole.value = newRole as string
      debouncedLoadData()
    }
  }
)

/* =============== 系列 =============== */
const currentYikawaSeries = ref('all') // 系列
const yikawaSeriesList = computed(() => {
  return seriesList.map((item) => ({
    ...item,
    name: t(item.name)
  }))
})

const dropdownSeriesVisible = ref(false)

const toggleDropdown = () => {
  dropdownSeriesVisible.value = !dropdownSeriesVisible.value
}

const selectOption = (index: number) => {
  currentYikawaSeries.value = yikawaSeriesList.value[index].key
  dropdownSeriesVisible.value = false
}

/* =============== 分類 =============== */
const currentYikawaCategory = ref('all') // 分類
const yikawaCategoriesList = computed(() => {
  return categoryList.map((item) => ({
    ...item,
    name: t(item.name)
  }))
})

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

interface PicData {
  _id?: string
  name: string
  nickname: string
  role: string
  series: string
  category: string
  isShow: number
  images: {
    id: number
    sort: number
    type: number
    url: string
    desc: string
    source: string
  }[]
}

const yikawaList = ref<PicData[]>([])

const pagination = ref({
  total: 0,
  totalPages: 0,
  currentPage: 1,
  limit: 20
})

async function loadData() {
  let data = {
    keyword: currentKeyword.value,
    role: currentRole.value,
    series: currentYikawaSeries.value,
    category: currentYikawaCategory.value,
    isShow: 1,
    page: pagination.value.currentPage,
    limit: pagination.value.limit
  }
  console.log('搜尋條件:', data)

  try {
    showLoading()
    const res = await store.apiGetPicDataList(data)
    const result = res.data
    if (result.statusCode === 200) {
      yikawaList.value = result.data.data
      pagination.value.total = result.data.pagination.total
      pagination.value.totalPages = result.data.pagination.totalPages
      pagination.value.currentPage = result.data.pagination.currentPage
      if (yikawaList.value.length <= 0) {
        showToast('沒有相關圖鑑，建議換個關鍵字查詢！')
      }
    } else {
      console.log('取得圖鑑資料失敗')
    }
  } catch (e) {
    console.log(e)
    showToast('取得圖鑑資料失敗')
  } finally {
    hideLoading()
  }
}

// 監聽手動篩選變數變化
watch(
  [currentRole, currentYikawaSeries, currentYikawaCategory],
  ([newRole, newSeries, newCategory]) => {
    debouncedLoadData()
  }
)

// 使用防抖的 loadData 函數
const debouncedLoadData = debounce(loadData, 300)

// 防抖函數
function debounce(fn: Function, delay: number) {
  let timer: NodeJS.Timeout | null = null
  return function (...args: any[]) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(null, args)
    }, delay)
  }
}

onMounted(() => {
  loadData()
})

// 更新分頁處理函數
const handlePageChange = (page: number) => {
  pagination.value.currentPage = page
  loadData()
}

/* =============== 圖鑑列表 =============== */

const selectedPic = ref<PicData | null>(null) // 新增：当前选中的图鉴
const showPicDetail = ref(false) // 新增：控制弹窗显示

// 查看圖鑑詳情
const openPicDetail = (pic: PicData) => {
  selectedPic.value = pic
  showPicDetail.value = true
  // 禁用背景滚动
  document.body.style.overflow = 'hidden'
}

// 關閉圖鑑詳情
const closePicDetail = () => {
  selectedPic.value = null
  showPicDetail.value = false
  // 恢复背景滚动
  document.body.style.overflow = 'auto'
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
      <div class="card" v-for="item in yikawaList" :key="item._id" @click="openPicDetail(item)">
        <div class="card-body">
          <div v-if="item.images && item.images.length > 0">
            <img :src="item.images[0].url" :alt="item.name" class="pic-auto" />
          </div>
          <h5 class="card-title">{{ item.name }}</h5>
          <div class="flex flex-wrap gap-2">
            <span class="card-text">{{ item.nickname }}</span>
            <span class="card-text">・</span>
            <span class="card-text">{{
              yikawaSeriesList.find((series) => series.key === item.series)?.name
            }}</span>
            <span class="card-text">・</span>
            <span class="card-text">{{
              yikawaCategoriesList.find((category) => category.key === item.category)?.name
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- * 圖鑑詳情 -->
    <div
      v-if="showPicDetail"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click="closePicDetail"
    >
      <div
        class="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6"
        @click.stop
      >
        <div class="mb-4 flex items-start justify-between">
          <h3 class="text-xl font-bold">{{ selectedPic?.name }}</h3>
          <button @click="closePicDetail" class="text-gray-500 hover:text-gray-700">
            <Icon name="material-symbols:close" size="40" />
          </button>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- 图片展示区 -->
          <div class="space-y-4">
            <div v-for="(image, index) in selectedPic?.images" :key="index">
              <img :src="image.url" :alt="selectedPic?.name" class="w-full rounded-lg" />
              <p class="mt-2 text-sm text-gray-600">{{ image.desc }}</p>
            </div>
          </div>

          <!-- 信息展示区 -->
          <div class="space-y-4">
            <div>
              <h4 class="font-semibold">暱稱</h4>
              <p>{{ selectedPic?.nickname }}</p>
            </div>
            <div>
              <h4 class="font-semibold">角色</h4>
              <p>{{ selectedPic?.role }}</p>
            </div>
            <div>
              <h4 class="font-semibold">系列</h4>
              <p>
                {{ yikawaSeriesList.find((series) => series.key === selectedPic?.series)?.name }}
              </p>
            </div>
            <div>
              <h4 class="font-semibold">分類</h4>
              <p>
                {{
                  yikawaCategoriesList.find((category) => category.key === selectedPic?.category)
                    ?.name
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- * 分頁 -->
    <div class="mt-8">
      <Pagination
        v-if="pagination.totalPages > 0"
        :current-page="pagination.currentPage"
        :total-pages="pagination.totalPages"
        @update:page="handlePageChange"
      />
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
