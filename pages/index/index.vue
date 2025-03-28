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
import {
  seriesList,
  categoryList,
  roleList,
  imageTypeList,
  naganoRoleList
} from '~/constants/yikawa'

const { t } = useI18n()

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

const allRoles = computed(() => {
  const merged = new Map()

  // 先加入吉伊卡哇角色
  roleList.forEach((role) => {
    merged.set(role.key, {
      ...role,
      type: 'yikawa',
      translatedName: t(role.name) // 預先翻譯名稱
    })
  })

  // 再加入長野角色
  naganoRoleList.forEach((role) => {
    if (merged.has(role.key)) {
      console.warn(`重複的角色 key: ${role.key}`)
    }
    merged.set(role.key, {
      ...role,
      type: 'nagano',
      translatedName: t(role.name) // 預先翻譯名稱
    })
  })

  return Array.from(merged.values())
})

const findRoleName = (roleKey: string | undefined) => {
  if (!roleKey) return '未知角色'
  const role = allRoles.value.find((role) => role.key === roleKey)
  if (!role) {
    console.warn(`找不到角色: ${roleKey}`)
    return '未知角色'
  }
  return role.translatedName
}

/* =============== 角色 =============== */
const roleInfoList = computed(() => {
  return roleList.map((item) => ({
    ...item,
    name: t(item.name)
  }))
})

const isBearSeries = computed(() => {
  return (
    currentRole.value === 'all_nagano' ||
    currentRole.value === 'polar_bear' ||
    currentRole.value === 'croquette' ||
    currentRole.value === 'sausage' ||
    currentRole.value === 'pug' ||
    currentRole.value === 'others_nagano'
  )
})

/* =============== 圖片類型 =============== */
const imageTypeInfoList = computed(() => {
  return imageTypeList.map((item) => ({
    ...item,
    name: t(item.name)
  }))
})

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

// 添加點擊外部關閉的處理函數
const handleClickOutside = (event: MouseEvent) => {
  const seriesSelect = document.querySelector('#series-select')
  const categorySelect = document.querySelector('#category-select')

  // 檢查點擊是否在下拉選單外部
  if (seriesSelect && !seriesSelect.contains(event.target as Node)) {
    dropdownSeriesVisible.value = false
  }

  if (categorySelect && !categorySelect.contains(event.target as Node)) {
    dropdownCategoryVisible.value = false
  }
}

// 在組件掛載時添加事件監聽
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// 在組件卸載時移除事件監聽
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

/* =============== 關鍵字 =============== */
const currentKeyword = ref('') // 關鍵字

const clearKeyword = () => {
  currentKeyword.value = ''
  loadData()
}

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

const isPicDataLoading = ref(false)

async function loadData() {
  let data = {
    keyword: currentKeyword.value,
    role: currentRole.value,
    series: isBearSeries.value ? 'all' : currentYikawaSeries.value,
    category: currentYikawaCategory.value,
    isShow: 1,
    page: pagination.value.currentPage,
    limit: pagination.value.limit
  }
  console.log('搜尋條件:', data)

  try {
    isPicDataLoading.value = true
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
    isPicDataLoading.value = false
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

// 組件消除時釋放
onBeforeUnmount(() => {
  selectedPic.value = null
  showPicDetail.value = false
  document.body.style.overflow = 'auto'
})

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
      <!-- ? 如果目前角色是白熊系列的不要顯示 -->
      <div v-if="!isBearSeries" class="relative w-full sm:w-[280px]" id="series-select">
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
      <div class="relative w-full sm:w-[280px]" id="category-select">
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
      <div class="custom-search-input relative grow">
        <input
          type="text"
          placeholder="搜尋關鍵字"
          v-model="currentKeyword"
          @keyup.enter="loadData"
        />
        <!-- 清除 -->
        <div
          v-if="currentKeyword"
          @click="clearKeyword"
          class="absolute right-[62px] top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
        >
          <Icon name="material-symbols:close" size="24"></Icon>
        </div>
        <button @click="loadData">
          <Icon name="material-symbols:search" size="28"></Icon>
        </button>
      </div>
    </div>

    <!-- * 骨架屏加載效果 -->
    <div
      v-if="isPicDataLoading"
      class="mt-4 grid grid-cols-1 gap-4 opacity-80 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="i in 5"
        :key="i"
        class="overflow-hidden rounded-xl border border-gray-300 bg-white/60"
      >
        <!-- 圖片區域骨架 -->
        <div class="skeleton-box h-[240px] w-full"></div>
        <!-- 內容區域骨架 -->
        <div class="flex flex-col p-4">
          <!-- 標題骨架 -->
          <div class="skeleton-box mb-2 h-6 w-3/4 rounded"></div>
          <!-- 內容行骨架 -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <div class="skeleton-box h-4 w-4 rounded"></div>
              <div class="skeleton-box h-4 w-1/2 rounded"></div>
            </div>
            <div class="flex items-center gap-2">
              <div class="skeleton-box h-4 w-4 rounded"></div>
              <div class="skeleton-box h-4 w-2/3 rounded"></div>
            </div>
            <div class="flex items-center gap-2">
              <div class="skeleton-box h-4 w-4 rounded"></div>
              <div class="skeleton-box h-4 w-1/2 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- * 圖鑑列表 -->
    <div
      v-if="yikawaList.length > 0 && !isPicDataLoading"
      class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        class="card h-full cursor-pointer"
        v-for="item in yikawaList"
        :key="item._id"
        @click="openPicDetail(item)"
      >
        <div
          class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-300 bg-white/60"
        >
          <div
            v-if="item.images && item.images.length > 0"
            class="relative flex h-[240px] w-full items-center justify-center overflow-hidden"
          >
            <img :src="item.images[0].url" :alt="item.name" class="pic-auto" />
            <CommonWatermark />
          </div>
          <div class="flex flex-1 flex-col p-4">
            <h5 class="mb-2 text-lg font-semibold">{{ item.name }}</h5>
            <div class="flex flex-col gap-2">
              <span v-if="item.nickname" class="flex items-center gap-2 text-sm">
                <Icon name="ph:pencil-line" size="16" class="text-primary5" />
                {{ item.nickname }}
              </span>
              <span class="flex items-center gap-2 text-sm">
                <Icon name="ph:squares-four" size="16" class="text-primary5" />
                {{ yikawaSeriesList.find((series) => series.key === item.series)?.name }}
              </span>
              <span class="flex items-center gap-2 text-sm">
                <Icon name="ph:rabbit" size="16" class="text-primary5" />
                {{ yikawaCategoriesList.find((category) => category.key === item.category)?.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- * 無資料 -->
    <div
      v-else-if="!isPicDataLoading && yikawaList.length <= 0"
      class="mt-4 text-center text-gray-500"
    >
      <p>暫時沒有搜集到相關圖鑑，建議換個關鍵字查詢！</p>
    </div>

    <!-- * 圖鑑詳情 -->
    <div
      v-if="showPicDetail"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click="closePicDetail"
    >
      <div
        class="mx-4 max-h-[90vh] w-full max-w-[1000px] overflow-y-auto rounded-lg bg-white p-6"
        @click.stop
      >
        <div class="mb-4 flex items-start justify-between">
          <h3 class="text-xl font-bold">{{ selectedPic?.name }}</h3>
          <button @click="closePicDetail" class="text-gray-500 hover:text-gray-700">
            <Icon name="material-symbols:close" size="40" />
          </button>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h4 class="font-semibold">角色</h4>
              <p>{{ findRoleName(selectedPic?.role) }}</p>
            </div>
            <div v-if="selectedPic?.nickname">
              <h4 class="font-semibold">暱稱</h4>
              <p>{{ selectedPic?.nickname }}</p>
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

          <hr class="my-4 border-gray-300" />

          <div class="flex flex-col gap-4">
            <div
              v-for="(image, index) in selectedPic?.images"
              :key="index"
              class="overflow-hidden rounded-xl border border-gray-300"
            >
              <div class="relative overflow-hidden">
                <img :src="image.url" :alt="selectedPic?.name" class="pic-auto" />
                <CommonWatermark />
              </div>
              <div class="px-2 pb-2 pt-1">
                <div class="flex justify-between gap-2 text-sm text-gray-600">
                  <p class="" :class="{ 'text-red-500': image.type === 2 }">
                    {{ imageTypeInfoList.find((item) => item.key === image.type)?.name }}
                  </p>
                  <p v-if="image.source">圖源：{{ image.source }}</p>
                </div>
                <p class="mt-1 text-lg text-gray-600">{{ image.desc }}</p>
              </div>
            </div>
          </div>

          <div class="mt-3 flex justify-center">
            <button @click="closePicDetail" class="custom-btn-secondary">關閉彈窗</button>
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

/* 骨架屏 */
.skeleton-box {
  position: relative;
  background-color: #e5e7eb;
  overflow: hidden;
}

.skeleton-box::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.2) 20%,
    rgba(255, 255, 255, 0.5) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: shimmer 2.5s infinite;
  transition: transform 0.3s ease-out;
  content: '';
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
