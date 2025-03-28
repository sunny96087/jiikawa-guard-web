<script setup lang="ts">
definePageMeta({
  layout: false
})

import { APIStore } from '~/store/apiService'
const store = APIStore()
import { showToast, openDialog, showLoading, hideLoading } from '~/store/eventBus'
import { useI18n } from 'vue-i18n'

import { roleList, seriesList, categoryList, statusList, naganoRoleList } from '~/constants/yikawa'

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
const currentRole = ref('all') // 角色
const role = computed(() => {
  return roleList.map((item) => ({
    ...item,
    name: t(item.name)
  }))
})

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

const findRoleName = (roleKey: string) => {
  if (!roleKey) return '未知角色'
  const role = allRoles.value.find((role) => role.key === roleKey)
  if (!role) {
    console.warn(`找不到角色: ${roleKey}`)
    return '未知角色'
  }
  return role.translatedName // 直接使用預先翻譯的名稱
}

// const dropdownRoleVisible = ref(false)

// const toggleDropdownRole = () => {
//   dropdownRoleVisible.value = !dropdownRoleVisible.value
// }

// const selectRoleOption = (index: number) => {
//   const list = role.value
//   currentRole.value = list[index].key
//   dropdownRoleVisible.value = false
//   loadData()
// }

// 轉換角色列表，添加多語言支持
const yikawaRolesList = computed(() => {
  return roleList
    .filter((item) => !item.key.includes('all'))
    .map((item) => ({
      ...item,
      name: t(item.name)
    }))
})

const naganoRolesList = computed(() => {
  return naganoRoleList
    .filter((item) => !item.key.includes('all'))
    .map((item) => ({
      ...item,
      name: t(item.name)
    }))
})

// 處理角色選擇
const handleRoleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  currentRole.value = target.value
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
const picDataList = ref<PicData[]>([])

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
    isShow: currentStatus.value,
    page: pagination.value.currentPage,
    limit: pagination.value.limit
  }
  console.log('搜尋條件:', data)

  // TODO: API 實作後替換
  try {
    showLoading()
    const res = await store.apiGetPicDataList(data)
    const result = res.data

    if (result.statusCode === 200) {
      picDataList.value = result.data.data
      pagination.value.total = result.data.pagination.total
      pagination.value.totalPages = result.data.pagination.totalPages
      pagination.value.currentPage = result.data.pagination.currentPage
      if (picDataList.value.length <= 0) {
        showToast('沒有相關圖鑑，建議換個關鍵字查詢！')
      }
    } else {
      console.log('取得圖鑑資料失敗')
    }
  } catch (e) {
    console.log(e)
  } finally {
    hideLoading()
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

/* =============== 新增圖鑑 =============== */

// 目前行為 新增/編輯
const isEdit = ref(false)

// 計算角色名稱列表，過濾掉全部選項，並合併吉伊卡哇和長野的角色
const characterNameList = computed(() => {
  const yikawaChars = roleList.filter((item) => !item.key.includes('all'))
  const naganoChars = naganoRoleList.filter((item) => !item.key.includes('all'))
  return [...yikawaChars, ...naganoChars]
})

const addPicDataModal = ref(false)

// 打開新增圖鑑資料彈窗
const openAddPicData = () => {
  isEdit.value = false
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
  } else {
    document.body.style.overflow = 'auto'
  }
})

// 新增圖鑑資料 預設值
const emptyPicData: PicData = {
  // _id: 0,
  role: 'chiikawa',
  name: '',
  nickname: '',
  category: 'others',
  series: 'others',
  isShow: 1,
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
const currentPicData = ref<PicData>({
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

// 新增一筆圖片資料
const addNewImage = () => {
  const maxId = Math.max(...currentPicData.value.images.map((img) => img.id), 0)
  const maxSort = Math.max(...currentPicData.value.images.map((img) => img.sort), 0)

  const newImage = {
    ...emptyPicDataPic,
    id: maxId + 1,
    sort: maxSort + 1
  }

  // 使用展開運算符確保響應式更新
  currentPicData.value = {
    ...currentPicData.value,
    images: [...currentPicData.value.images, newImage]
  }
}

// 刪除一筆圖片資料
const removeImage = (index: number) => {
  const updatedImages = [...currentPicData.value.images]
  updatedImages.splice(index, 1)

  // 重新排序
  updatedImages.forEach((image, idx) => {
    image.sort = idx + 1
  })

  // 使用展開運算符確保響應式更新
  currentPicData.value = {
    ...currentPicData.value,
    images: updatedImages
  }
}

// 處理圖片上傳
const handleImageUpload = async (event: Event, index: number) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    showLoading()
    const formData = new FormData()
    formData.append('file', file)

    const res = await store.apiUploadImage(formData as any)
    const result = res.data

    if (result.statusCode === 200) {
      // 更新圖片網址
      const updatedImages = [...currentPicData.value.images]
      updatedImages[index] = {
        ...updatedImages[index],
        url: result.data.imgUrl
      }
      currentPicData.value = {
        ...currentPicData.value,
        images: updatedImages
      }
      showToast('圖片上傳成功')
    } else {
      showToast('圖片上傳失敗')
    }
  } catch (e) {
    console.error(e)
    showToast('圖片上傳失敗')
  } finally {
    hideLoading()
    // 清空 input 值
    ;(event.target as HTMLInputElement).value = ''
  }
}

// 可以添加一個清除圖片的輔助函數
const clearImage = (index: number) => {
  const updatedImages = [...currentPicData.value.images]
  updatedImages[index] = {
    ...updatedImages[index],
    url: ''
  }
  currentPicData.value = {
    ...currentPicData.value,
    images: updatedImages
  }
}

/**
 * 儲存圖鑑資料
 *
 */
const savePicData = async () => {
  console.log('儲存圖鑑資料')
  console.log(currentPicData.value)

  try {
    showLoading()
    console.log('儲存圖鑑資料')
    console.log(currentPicData.value)
    if (isEdit.value) {
      const res = await store.apiUpdatePicData(currentPicData.value)
      const result = res.data
      if (result.statusCode === 200) {
        showToast('編輯圖鑑成功')
        closeEditPicData()

        // 重新載入圖鑑列表
        loadData()
      } else {
        showToast('編輯圖鑑失敗')
      }
    } else {
      const res = await store.apiAddPicData(currentPicData.value)

      const result = res.data
      if (result.statusCode === 200) {
        // 關閉彈窗
        addPicDataModal.value = false

        showToast('新增圖鑑成功')

        // 完全重置為新的物件，包含只有一筆的圖片列表
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

        // 重新載入圖鑑列表
        loadData()
      } else {
        showToast('新增圖鑑失敗')
      }
    }
  } catch (e: any) {
    console.log(e)
    showToast(e.response.data.message)
  } finally {
    hideLoading()
  }
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
    isShow: 1,
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

/* =============== 編輯圖鑑 =============== */

const editPicDataModal = ref(false)

const openEditPicData = (item: PicData) => {
  isEdit.value = true
  addPicDataModal.value = true
  // 重新創建圖片數據，確保每個圖片都有唯一的 id
  currentPicData.value = {
    ...item,
    images: item.images.map((img, index) => ({
      ...img,
      id: index + 1 // 重新分配 id
    }))
  }
}

const closeEditPicData = () => {
  isEdit.value = false
  addPicDataModal.value = false
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

/* =============== 刪除圖鑑 =============== */

const deletePicData = async (item: PicData) => {
  console.log('刪除圖鑑')
  console.log(item)
  const confirmed = await openDialog('注意', '確定要刪除嗎？')
  if (!confirmed) {
    return
  }

  try {
    showLoading()
    console.log('刪除圖鑑')
    console.log(item._id)
    let data: any = {
      _id: item._id
    }
    const res = await store.apiDeletePicData(data)
    const result = res.data
    if (result.statusCode === 200) {
      showToast('刪除圖鑑成功')
      loadData()
    } else {
      showToast('刪除圖鑑失敗')
    }
  } catch (e) {
    console.log(e)
    showToast('刪除圖鑑失敗')
  } finally {
    hideLoading()
  }
}
</script>

<template>
  <div class="index">
    <!-- 篩選列 -->
    <div class="flex flex-col lg:flex-row lg:gap-3">
      <div class="flex flex-col gap-3 sm:flex-row">
        <!-- * 角色選擇 -->
        <div class="w-full sm:w-[200px]">
          <select v-model="currentRole" @change="handleRoleChange" class="custom-select">
            <option value="all">全部角色</option>
            <!-- 吉伊卡哇角色 -->
            <optgroup label="吉伊卡哇">
              <option v-for="char in yikawaRolesList" :key="char.key" :value="char.key">
                {{ char.name }}
              </option>
            </optgroup>
            <!-- 長野角色 -->
            <optgroup label="長野">
              <option v-for="char in naganoRolesList" :key="char.key" :value="char.key">
                {{ char.name }}
              </option>
            </optgroup>
          </select>
        </div>

        <!-- * 系列選擇 -->
        <div class="w-full sm:w-[200px]">
          <select v-model="currentYikawaSeries" @change="loadData" class="custom-select">
            <option v-for="item in yikawaSeriesList" :key="item.key" :value="item.key">
              {{ item.name }}
            </option>
          </select>
        </div>

        <!-- * 分類選擇 -->
        <div class="w-full sm:w-[200px]">
          <select v-model="currentYikawaCategory" @change="loadData" class="custom-select">
            <option v-for="item in yikawaCategoriesList" :key="item.key" :value="item.key">
              {{ item.name }}
            </option>
          </select>
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
      <div class="card" v-for="item in picDataList" :key="item._id">
        <div class="card-body">
          <div
            v-if="item.images && item.images.length > 0"
            class="relative h-[240px] items-center justify-center overflow-hidden"
          >
            <img :src="item.images[0].url" :alt="item.name" class="pic-auto" />
          </div>
          <h5 class="card-title">{{ item.name }}</h5>
          <div class="flex flex-wrap gap-2">
            <span class="card-text">{{ findRoleName(item.role) }}</span>
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

          <!-- 編輯 刪除 -->
          <div class="flex justify-end gap-2">
            <button class="custom-btn-secondary" @click="openEditPicData(item)">編輯</button>
            <button class="custom-btn-danger-stroke" @click="deletePicData(item)">刪除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分頁 -->
    <Pagination
      v-if="pagination.totalPages > 1"
      :current-page="pagination.currentPage"
      :total-pages="pagination.totalPages"
      @update:page="handlePageChange"
    />

    <!-- * 新增圖鑑 modal -->
    <div
      class="fixed inset-0 z-50 flex h-full items-start justify-center overflow-y-auto bg-black/30 p-4 pt-10"
      v-if="addPicDataModal"
    >
      <div class="relative mb-10 w-full max-w-3xl rounded-lg border-2 border-gray-300 bg-white p-4">
        <h5 class="mb-4 text-xl font-bold">{{ isEdit ? '編輯圖鑑' : '新增圖鑑' }}</h5>
        <div class="modal-body">
          <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-2">
              <label for="role">角色</label>

              <select id="role" v-model="currentPicData.role" class="custom-select">
                <option value="">請選擇角色名稱</option>
                <!-- 吉伊卡哇角色 -->
                <optgroup label="吉伊卡哇">
                  <option
                    v-for="char in roleList.filter((item) => !item.key.includes('all'))"
                    :key="char.key"
                    :value="char.key"
                  >
                    {{ t(char.name) }}
                  </option>
                </optgroup>
                <!-- 長野角色 -->
                <optgroup label="長野">
                  <option
                    v-for="char in naganoRoleList.filter((item) => !item.key.includes('all'))"
                    :key="char.key"
                    :value="char.key"
                  >
                    {{ t(char.name) }}
                  </option>
                </optgroup>
              </select>

              <label for="name">名稱</label>
              <input
                id="name"
                v-model="currentPicData.name"
                type="text"
                placeholder="請輸入名稱..."
                class="custom-input"
              />

              <label for="nickname">社群常見暱稱 (多個請用, 分隔開來)</label>
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

              <label for="series">系列 (長野角色不用分系列)</label>
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
              <TransitionGroup name="list" tag="div">
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
                  <!-- <div class="flex flex-col gap-2">
                    <label :for="'image-' + index">圖片</label>
                    <div class="flex flex-col gap-2">
              
                      <img
                        v-if="image.url"
                        :src="image.url"
                        :alt="image.desc || '預覽圖片'"
                        class="h-auto w-full rounded-lg"
                      />
          
                      <input
                        :id="'image-' + index"
                        type="file"
                        class="custom-input"
                        accept="image/*"
                        @change="(e) => handleImageUpload(e, index)"
                      />
                    </div>
                  </div> -->

                  <!-- 修改圖片上傳部分的模板 -->
                  <!-- 圖片 -->
                  <div class="flex flex-col gap-2">
                    <label>圖片</label>
                    <div class="flex flex-col gap-4">
                      <!-- 上傳按鈕和圖片網址輸入框 -->
                      <div class="flex items-center gap-2">
                        <div class="relative">
                          <input
                            :id="'image-' + index"
                            type="file"
                            class="hidden"
                            accept="image/*"
                            @change="(e) => handleImageUpload(e, index)"
                          />
                          <label
                            :for="'image-' + index"
                            class="custom-btn-secondary flex cursor-pointer items-center gap-2"
                          >
                            <Icon name="material-symbols:upload" size="20" />
                            <span>上傳圖片</span>
                          </label>
                        </div>
                        <input
                          v-model="image.url"
                          type="text"
                          class="custom-input flex-1"
                          placeholder="或輸入圖片網址..."
                        />
                      </div>

                      <!-- 圖片預覽 -->
                      <div v-if="image.url" class="relative rounded-lg border border-gray-200 p-2">
                        <img
                          :src="image.url"
                          :alt="image.desc || '預覽圖片'"
                          class="h-auto w-full rounded-lg"
                        />
                        <!-- 移除圖片按鈕 -->
                        <button
                          @click="image.url = ''"
                          class="cus-hover absolute right-4 top-4 flex items-center justify-center rounded-full bg-white/80 p-1 text-gray-600 hover:bg-white hover:text-red-500"
                        >
                          <Icon name="material-symbols:close" size="32" />
                        </button>
                      </div>
                    </div>
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
              </TransitionGroup>

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
  @apply rounded-lg border-2 border-gray-300 bg-white/20 p-3;
}

.card-body {
  @apply flex flex-col gap-2;
}

.card-title {
  @apply text-xl font-bold;
}

.card-text {
  @apply text-lg text-gray-600;
}

/* 修改過渡動畫效果 */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
