<script setup lang="ts">
definePageMeta({
  layout: false
})

import { APIStore } from '~/store/apiService'
const store = APIStore()
import { showToast, openDialog, showLoading, hideLoading } from '~/store/eventBus'
import { useI18n } from 'vue-i18n'

import { roleList, seriesList, categoryList, statusList } from '~/constants/yikawa'

const { t } = useI18n()

/**
 * 圖鑑管理
 *
 * 新增圖鑑
 * 修改圖鑑
 * 刪除圖鑑
 *
 */

/**
 * 圖鑑功能 欄位
 *
 * 單筆資料
 * role: 角色
 * name: 名稱
 * category: 分類
 * series: 系列
 * isShow: 1, // 1: 顯示 0: 隱藏
 * 圖片列表:
 *   {
 *     id: 1,
 *     sort: 1,
 *     type: 1, // 1: 正版 2: 盜版 3: 正盜版比對
 *     url: '圖片路徑',
 *     desc: '描述',
 *     source: '提供者',
 *   }
 */

// 搜尋關鍵字
const currentKeyword = ref('')

/* =============== 角色 =============== */
const currentRole = ref('all_chiikawa') // 角色
const role = computed(() => {
  return roleList.map((item) => ({
    ...item,
    name: t(item.name)
  }))
})

const dropdownRoleVisible = ref(false)

const toggleDropdownRole = () => {
  dropdownRoleVisible.value = !dropdownRoleVisible.value
}

const selectRoleOption = (index: number) => {
  const list = role.value
  currentRole.value = list[index].key
  dropdownRoleVisible.value = false
  loadData()
}

/* =============== 系列 =============== */
const currentYikawaSeries = ref('all') // 系列
const yikawaSeriesList = computed(() => {
  return seriesList.map((item) => ({
    ...item,
    name: t(item.name)
  }))
})

const dropdownSeriesVisible = ref(false)

const toggleDropdownSeries = () => {
  dropdownSeriesVisible.value = !dropdownSeriesVisible.value
}

const selectSeriesOption = (index: number) => {
  const list = yikawaSeriesList.value
  currentYikawaSeries.value = list[index].key
  dropdownSeriesVisible.value = false
  loadData()
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

const selectCategoryOption = (index: number) => {
  const list = yikawaCategoriesList.value
  currentYikawaCategory.value = list[index].key
  dropdownCategoryVisible.value = false
  loadData()
}

/* =============== 顯示狀態 =============== */
const currentStatus = ref('all') // 狀態
const status = computed(() => {
  return statusList.map((item) => ({
    ...item,
    name: t(item.name)
  }))
})

const dropdownStatusVisible = ref(false)

const toggleDropdownStatus = () => {
  dropdownStatusVisible.value = !dropdownStatusVisible.value
}

const selectStatusOption = (index: number) => {
  currentStatus.value = status.value[index].key
  dropdownStatusVisible.value = false
  loadData()
}

/* =============== 圖鑑列表 =============== */
const picDataList = ref([
  {
    id: 1,
    role: 'hachiware',
    name: '哈姬玩偶',
    category: 'plush',
    series: 'soft_plush',
    isShow: 1,
    images: [
      {
        id: 1,
        sort: 1,
        type: 1,
        url: 'https://placehold.co/600x400',
        desc: '正版圖片1',
        source: '官方商店'
      },
      {
        id: 2,
        sort: 2,
        type: 2,
        url: 'https://placehold.co/600x400',
        desc: '盜版圖片1',
        source: '淘寶'
      }
    ]
  },
  {
    id: 2,
    role: 'chiikawa',
    name: '奇卡瓦玩偶',
    category: 'plush',
    series: 'cafe',
    isShow: 1,
    images: [
      {
        id: 3,
        sort: 1,
        type: 1,
        url: 'https://placehold.co/600x400',
        desc: '正版圖片1',
        source: '官方商店'
      }
    ]
  },
  {
    id: 3,
    role: 'usagi',
    name: '兔子鑰匙圈',
    category: 'keychain',
    series: 'yomiuri_giants',
    isShow: 0,
    images: [
      {
        id: 4,
        sort: 1,
        type: 1,
        url: 'https://placehold.co/600x400',
        desc: '正版圖片1',
        source: '官方商店'
      }
    ]
  }
])

async function loadData() {
  let data = {
    keyword: currentKeyword.value,
    role: currentRole.value,
    series: currentYikawaSeries.value,
    category: currentYikawaCategory.value,
    isShow: currentStatus.value
  }
  console.log('搜尋條件:', data)

  // TODO: API 實作後替換
  // try {
  //   showLoading()
  //   const res = await store.apiGetPicData(data)
  //   const result = res.data
  //   if (result.statusCode === 200) {
  //     picDataList.value = result.data
  //   } else {
  //     console.log('取得圖鑑資料失敗')
  //   }
  // } catch (e) {
  //   console.log(e)
  // } finally {
  //   hideLoading()
  // }
}

onMounted(() => {
  loadData()
})

/* =============== 新增圖鑑 =============== */
const addPicDataModal = ref(false)

// 打開新增圖鑑資料彈窗
const openAddPicData = () => {
  addPicDataModal.value = true
  currentPicData.value = {
    ...emptyPicData,
    images: [
      {
        id: 1,
        sort: 1,
        type: 1,
        url: '',
        desc: '',
        source: ''
      }
    ]
  }
}

// 彈窗打開時鎖住 body scroll bar
watch(addPicDataModal, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  }
})

// 新增圖鑑資料 預設值
const emptyPicData = {
  role: 'chiikawa',
  name: '',
  nickname: '',
  category: 'others',
  series: 'others',
  isShow: '1',
  images: [
    {
      id: 1,
      sort: 1,
      type: 1,
      url: '',
      desc: '',
      source: ''
    }
  ]
}

// 目前編輯的圖鑑資料
const currentPicData = ref({
  ...emptyPicData
})

// 新增圖片資料
const emptyPicDataPic = {
  id: 0, // 新增 id 欄位
  sort: 1,
  type: 1,
  url: '',
  desc: '',
  source: ''
}

// 新增圖片
const addNewImage = () => {
  const newImage = { ...emptyPicDataPic }
  // 取得目前最大的 id 和 sort
  const maxId = Math.max(...currentPicData.value.images.map((img) => img.id), 0)
  const maxSort = Math.max(...currentPicData.value.images.map((img) => img.sort), 0)

  newImage.id = maxId + 1
  newImage.sort = maxSort + 1
  currentPicData.value.images.push(newImage)
}

// 刪除圖片
const removeImage = (index: number) => {
  currentPicData.value.images.splice(index, 1)
  // 重新排序
  currentPicData.value.images.forEach((image, idx) => {
    image.sort = idx + 1
  })
}

/**
 * 儲存圖鑑資料
 *
 */
const savePicData = () => {
  console.log('儲存圖鑑資料')
  console.log(currentPicData.value)

  // TODO: API 實作後替換
  // try {
  //   showLoading()
  //   const res = await store.apiGetPicData(data)
  //   const result = res.data
  // } catch (e) {
  //   console.log(e)
  // } finally {
  //   hideLoading()
  // }

  // 完全重置為新的物件，包含只有一筆的圖片列表
  currentPicData.value = {
    role: 'chiikawa',
    name: '',
    nickname: '',
    category: 'others',
    series: 'others',
    isShow: '1',
    images: [
      {
        id: 1,
        sort: 1,
        type: 1,
        url: '',
        desc: '',
        source: ''
      }
    ]
  }

  // 關閉彈窗
  addPicDataModal.value = false

  // 重新載入圖鑑列表
  loadData()
}

/**
 * 取消儲存
 * 檢查是否有輸入中的資料，有的話提示是否確定要取消並返回
 * 沒有的話直接返回
 */
const cancelSavePicData = async () => {
  console.log('取消儲存')
  if (currentPicData.value.name || currentPicData.value.nickname) {
    const confirmed = await openDialog('注意', '確定要取消並返回嗎？')
    if (!confirmed) {
      return
    }
  }

  // 完全重置為新的物件，包含只有一筆的圖片列表
  currentPicData.value = {
    role: 'chiikawa',
    name: '',
    nickname: '',
    category: 'others',
    series: 'others',
    isShow: '1',
    images: [
      {
        id: 1,
        sort: 1,
        type: 1,
        url: '',
        desc: '',
        source: ''
      }
    ]
  }

  addPicDataModal.value = false
}
</script>

<template>
  <div class="index">
    <!-- 篩選列 -->
    <div class="flex flex-col lg:flex-row lg:gap-3">
      <div class="flex flex-col gap-3 sm:flex-row">
        <!-- 角色選擇 -->
        <div class="relative w-full min-w-[128px]">
          <div class="custom-select" @click="toggleDropdownRole">
            {{ role.find((item) => item.key === currentRole)?.name }}
            <Icon name="material-symbols:keyboard-arrow-down" size="26"></Icon>
          </div>
          <div class="custom-select-options" v-if="dropdownRoleVisible">
            <div
              class="option"
              :class="{ 'option-selected': item.key === currentRole }"
              v-for="(item, index) in role"
              :key="index"
              @click="selectRoleOption(index)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>

        <!-- 系列選擇 -->
        <div class="relative w-full min-w-[128px]">
          <div class="custom-select" @click="toggleDropdownSeries">
            {{ yikawaSeriesList.find((item) => item.key === currentYikawaSeries)?.name }}
            <Icon name="material-symbols:keyboard-arrow-down" size="26"></Icon>
          </div>
          <div class="custom-select-options" v-if="dropdownSeriesVisible">
            <div
              class="option"
              :class="{ 'option-selected': item.key === currentYikawaSeries }"
              v-for="(item, index) in yikawaSeriesList"
              :key="index"
              @click="selectSeriesOption(index)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>

        <!-- 分類選擇 -->
        <div class="relative w-full min-w-[128px]">
          <div class="custom-select" @click="toggleDropdownCategory">
            {{ yikawaCategoriesList.find((item) => item.key === currentYikawaCategory)?.name }}
            <Icon name="material-symbols:keyboard-arrow-down" size="26"></Icon>
          </div>
          <div class="custom-select-options" v-if="dropdownCategoryVisible">
            <div
              class="option"
              :class="{ 'option-selected': item.key === currentYikawaCategory }"
              v-for="(item, index) in yikawaCategoriesList"
              :key="index"
              @click="selectCategoryOption(index)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>

        <!-- 狀態選擇 -->
        <div class="relative w-full min-w-[128px]">
          <div class="custom-select" @click="toggleDropdownStatus">
            {{ status.find((item) => item.key === currentStatus)?.name }}
            <Icon name="material-symbols:keyboard-arrow-down" size="26"></Icon>
          </div>
          <div class="custom-select-options" v-if="dropdownStatusVisible">
            <div
              class="option"
              :class="{ 'option-selected': item.key === currentStatus }"
              v-for="(item, index) in status"
              :key="index"
              @click="selectStatusOption(index)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- 關鍵字查詢 -->
      <div class="custom-search-input mt-3 grow lg:mt-0">
        <input
          type="text"
          placeholder="搜尋圖鑑"
          v-model="currentKeyword"
          @keyup.enter="loadData"
        />
        <button @click="loadData">
          <Icon name="material-symbols:search" size="28"></Icon>
        </button>
      </div>
    </div>

    <!-- 新增圖鑑 -->
    <div class="mt-4 flex justify-end">
      <button class="custom-btn-secondary" @click="openAddPicData">新增圖鑑</button>
    </div>

    <!-- 圖鑑列表 -->
    <div class="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      <div class="card" v-for="item in picDataList" :key="item.id">
        <div class="card-body">
          <div v-if="item.images && item.images.length > 0">
            <img :src="item.images[0].url" :alt="item.name" class="pic-auto" />
          </div>
          <h5 class="card-title">{{ item.name }}</h5>
          <div class="flex flex-wrap gap-2">
            <span class="card-text">{{ role.find((role) => role.key === item.role)?.name }}</span>
            <span class="card-text">・</span>
            <span class="card-text">{{
              yikawaSeriesList.find((series) => series.key === item.series)?.name
            }}</span>
            <span class="card-text">・</span>
            <span class="card-text">{{
              yikawaCategoriesList.find((category) => category.key === item.category)?.name
            }}</span>
            <span class="card-text">・</span>
            <span class="card-text">{{ item.isShow === 1 ? '顯示' : '隱藏' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- * 新增圖鑑 modal -->
    <div
      class="fixed inset-0 z-50 flex h-full items-center justify-center bg-black/30 p-10"
      v-if="addPicDataModal"
    >
      <div class="max-h-[90vh] overflow-auto rounded-lg border-2 border-gray-300 bg-white p-4">
        <h5 class="mb-4 text-xl font-bold">新增圖鑑</h5>
        <div class="modal-body">
          <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-2">
              <label for="role">角色</label>

              <select id="role" v-model="currentPicData.role" class="custom-select">
                <option v-for="item in role" :key="item.key" :value="item.key">
                  {{ item.name }}
                </option>
              </select>

              <label for="name">名稱</label>
              <input
                id="name"
                v-model="currentPicData.name"
                type="text"
                placeholder="請輸入名稱..."
                class="custom-input"
              />

              <label for="nickname">社群常見暱稱 (多個請用、分隔開來)</label>
              <input
                id="nickname"
                v-model="currentPicData.nickname"
                type="text"
                placeholder="請輸入暱稱..."
                class="custom-input"
              />

              <label for="category">分類</label>
              <select id="category" v-model="currentPicData.category" class="custom-select">
                <option v-for="item in yikawaCategoriesList" :key="item.key" :value="item.key">
                  {{ item.name }}
                </option>
              </select>

              <label for="series">系列</label>
              <select id="series" v-model="currentPicData.series" class="custom-select">
                <option v-for="item in yikawaSeriesList" :key="item.key" :value="item.key">
                  {{ item.name }}
                </option>
              </select>

              <label for="isShow">顯示狀態</label>
              <select id="isShow" v-model="currentPicData.isShow" class="custom-select">
                <option v-for="item in status" :key="item.key" :value="item.key">
                  {{ item.name }}
                </option>
              </select>

              <!-- ? 圖片 
                   *   sort: 1,
                   *   type: 1, // 1: 正版 2: 盜版 3: 正盜版比對
                   *   url: '圖片路徑',
                   *   desc: '描述',
                   *   source: '提供者',
                   -->
              <div class="flex items-center justify-between">
                <h4 class="mb-2 mt-4 text-lg font-bold">圖片列表</h4>
                <button class="custom-btn-secondary" @click="addNewImage">新增一筆圖片</button>
              </div>
              <div
                v-for="(image, index) in currentPicData.images"
                :key="image.id"
                class="mb-4 flex flex-col gap-2 rounded-lg border-2 border-gray-300 p-4"
              >
                <div class="flex justify-end">
                  <button
                    class="text-red-500 hover:text-red-700"
                    @click="removeImage(index)"
                    :disabled="currentPicData.images.length === 1"
                  >
                    <Icon name="material-symbols:delete-outline" size="24" />
                  </button>
                </div>

                <!-- sort -->
                <div class="flex flex-col gap-2">
                  <label :for="'sort-' + index">排序</label>
                  <input
                    :id="'sort-' + index"
                    v-model="image.sort"
                    type="number"
                    class="custom-input"
                  />
                </div>

                <!-- 圖片 -->
                <div class="flex flex-col gap-2">
                  <label :for="'image-' + index">圖片</label>
                  <input :id="'image-' + index" type="file" class="custom-input" />
                </div>

                <!-- 描述 -->
                <div class="flex flex-col gap-2">
                  <label :for="'desc-' + index">描述</label>
                  <input
                    :id="'desc-' + index"
                    v-model="image.desc"
                    type="text"
                    class="custom-input"
                  />
                </div>

                <!-- 提供者 -->
                <div class="flex flex-col gap-2">
                  <label :for="'source-' + index">提供者</label>
                  <input
                    :id="'source-' + index"
                    v-model="image.source"
                    type="text"
                    class="custom-input"
                  />
                </div>

                <!-- 類型 -->
                <div class="flex flex-col gap-2">
                  <label :for="'type-' + index">類型</label>
                  <select :id="'type-' + index" v-model="image.type" class="custom-select">
                    <option value="1">正版</option>
                    <option value="2">盜版</option>
                    <option value="3">正盜版比對</option>
                  </select>
                </div>
              </div>

              <div class="flex justify-end gap-4">
                <button class="custom-btn-gray" @click="cancelSavePicData">取消</button>
                <button class="custom-btn-secondary" @click="savePicData">儲存</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  @apply rounded-lg border-2 border-gray-300 bg-white p-3;
}

.card-body {
  @apply flex flex-col gap-2;
}

.card-title {
  @apply text-lg font-bold;
}

.card-text {
  @apply text-sm text-gray-600;
}

.pic-auto {
  @apply h-auto w-full rounded-lg object-cover;
}
</style>
