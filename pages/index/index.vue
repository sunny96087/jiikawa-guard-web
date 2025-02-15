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

const yikawaSeriesList = computed(() => [
  {
    id: 1,
    key: 'parallel_world',
    name: t('yikawa_series.parallel_world')
  },
  {
    id: 2,
    key: 'cake',
    name: t('yikawa_series.cake')
  },
  {
    id: 3,
    key: 'sushi',
    name: t('yikawa_series.sushi')
  },
  {
    id: 4,
    key: 'shisa_festival',
    name: t('yikawa_series.shisa_festival')
  },
  {
    id: 5,
    key: 'yomiuri_giants',
    name: t('yikawa_series.yomiuri_giants')
  },
  {
    id: 6,
    key: 'ramen_pig',
    name: t('yikawa_series.ramen_pig')
  },
  {
    id: 7,
    key: 'true_false_chiikawa',
    name: t('yikawa_series.true_false_chiikawa')
  },
  {
    id: 8,
    key: 'restaurant',
    name: t('yikawa_series.restaurant')
  },
  {
    id: 9,
    key: 'hankyu_train',
    name: t('yikawa_series.hankyu_train')
  },
  {
    id: 10,
    key: 'hawks',
    name: t('yikawa_series.hawks')
  },
  {
    id: 11,
    key: 'outing',
    name: t('yikawa_series.outing')
  },
  {
    id: 12,
    key: 'aquarium',
    name: t('yikawa_series.aquarium')
  },
  {
    id: 13,
    key: 'angel_devil',
    name: t('yikawa_series.angel_devil')
  },
  {
    id: 14,
    key: 'sanrio',
    name: t('yikawa_series.sanrio')
  },
  {
    id: 15,
    key: 'tokyo_specialty',
    name: t('yikawa_series.tokyo_specialty')
  },
  {
    id: 16,
    key: 'kindergarten',
    name: t('yikawa_series.kindergarten')
  },
  {
    id: 17,
    key: 'hotel',
    name: t('yikawa_series.hotel')
  },
  {
    id: 18,
    key: 'chiikawa_land',
    name: t('yikawa_series.chiikawa_land')
  }
])

// TODO 下面是舊的
const currentPostType = ref(0)
const postTypeOption = ['最新貼文', '熱門貼文', '最舊貼文']
// const currentKeyword = ref('')

const dropdownVisible = ref(false)

// 創建一個响應式屬性來存儲 postList
const postList: any = ref([])
import defaultAvatar from '~/assets/images/userPic.png'

// 取得使用者按讚文章列表
const likePostList: any = ref([])
const userData: any = ref([])

// 創建一個响應式屬性來存儲留言內容
const commentContent = ref('')

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value
}

const selectOption = (index: number) => {
  currentPostType.value = index
  dropdownVisible.value = false
  console.log(`currentPostType.value = ${currentPostType.value}`)
}

// onMounted(() => {
//   getUserData()
//   loadData()
// })
// 使用 watch 來監聽 currentPostType 的變化
// watch(currentPostType, () => {
//   loadData()
// })

// async function loadData() {
//   let currentSort = 'newest'
//   if (currentPostType.value === 1) {
//     currentSort = 'mostLiked'
//   } else if (currentPostType.value === 2) {
//     currentSort = 'oldest'
//   }

//   // console.log(`currentSort = ${currentSort}`)

//   let data = {
//     sort: currentSort,
//     keyword: currentKeyword.value
//   }
//   console.log(data)

//   try {
//     showLoading()
//     const res = (await store.apiGetPost(data)) as apiResponse
//     const result = res.data
//     // console.log(`editEvent result = ${JSON.stringify(result)}`)

//     if (result.status === 'success') {
//       // 提示成功
//       console.log('取得貼文成功')

//       // 把資料放到 list
//       postList.value = result.data
//       // console.log(`postList = ${JSON.stringify(postList.value)}`)
//       if (postList.value.length <= 0) {
//         showToast('沒有相關文章，建議換個關鍵字查詢！')
//       } else {
//         // showToast('取得貼文成功')
//       }
//     } else {
//       console.log('取得貼文失敗')
//     }
//   } catch (e) {
//     console.log(e)
//   } finally {
//     hideLoading()
//   }
// }

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
    <div class="flex gap-3">
      <!-- 貼文種類選擇 -->
      <!-- <div class="relative min-w-[128px]">
        <div class="custom-select" @click="toggleDropdown">
          {{ postTypeOption[currentPostType] }}
          <Icon name="material-symbols:keyboard-arrow-down" size="26"></Icon>
        </div>
        <div class="custom-select-options" v-if="dropdownVisible">
          <div
            class="option"
            :class="{ 'option-selected': index === currentPostType }"
            v-for="(option, index) in postTypeOption"
            :key="index"
            @click="selectOption(index)"
          >
            {{ option }}
          </div>
        </div>
      </div> -->

      <!-- 關鍵字查詢 -->
      <!-- <div class="custom-search-input grow">
        <input type="text" placeholder="搜尋貼文" v-model="currentKeyword" @keyup.enter="loadData" />
        <button @click="loadData">
          <Icon name="material-symbols:search" size="28"></Icon>
        </button>
      </div> -->
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
