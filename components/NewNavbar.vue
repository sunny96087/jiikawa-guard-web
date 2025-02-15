<script setup lang="ts">
import type { apiResponse } from '~/models'
import { APIStore } from '~/store/apiService'
const store = APIStore()
import { showToast, openDialog, showLoading, hideLoading } from '~/store/eventBus'
const router = useRouter()
const route = useRoute()
import defaultAvatar from '~/assets/images/userPic.png'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const menu = ref(false)

// 側邊欄
const showSidebar = ref(false)

// 當路由跳轉時，隱藏側邊欄
onBeforeRouteUpdate(() => {
  showSidebar.value = false
})

// 判斷當前路由和 tab 參數
const currentTab = computed(() => {
  if (route.path === '/home/profile') {
    return Number(route.query.tab) || 0 // 如果沒有 tab 參數，返回 0
  }
  return null
})

// 根據不同 tab 返回不同的 class 或狀態
const getTabClass = (tab: number) => {
  return {
    'sidebar-item': true,
    'sidebar-item-active': currentTab.value === tab
  }
}

// 選單打開時鎖住 body scroll bar
watch(showSidebar, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
})

// 將 yikawaList 改為計算屬性
const yikawaList = computed(() => [
  {
    id: 1,
    key: 'chiikawa',
    name: t('yikawa.chiikawa')
  },
  {
    id: 2,
    key: 'hachiware',
    name: t('yikawa.hachiware')
  },
  {
    id: 3,
    key: 'usagi',
    name: t('yikawa.usagi')
  },
  {
    id: 4,
    key: 'momonga',
    name: t('yikawa.momonga')
  },
  {
    id: 5,
    key: 'kurimanjuu',
    name: t('yikawa.kurimanjuu')
  },
  {
    id: 6,
    key: 'rakko',
    name: t('yikawa.rakko')
  },
  {
    id: 7,
    key: 'shisa',
    name: t('yikawa.shisa')
  },
  {
    id: 8,
    key: 'kani',
    name: t('yikawa.kani')
  },
  {
    id: 9,
    key: 'ano_ko',
    name: t('yikawa.ano_ko')
  },
  {
    id: 10,
    key: 'daistrong',
    name: t('yikawa.daistrong')
  },
  {
    id: 11,
    key: 'sou',
    name: t('yikawa.sou')
  },
  {
    id: 12,
    key: 'chimera',
    name: t('yikawa.chimera')
  },
  {
    id: 13,
    key: 'yoroisan',
    name: t('yikawa.yoroisan')
  },
  {
    id: 14,
    key: 'kabutomushi',
    name: t('yikawa.kabutomushi')
  },
  {
    id: 15,
    key: 'yousei',
    name: t('yikawa.yousei')
  },
  {
    id: 16,
    key: 'hoshi',
    name: t('yikawa.hoshi')
  }
])

const currentKeyword = computed(() => {
  return (route.query.keyword as string) || 'usagi'
})

const isYikawaListExpanded = ref(true) // 控制列表展開/收合的狀態

const toggleList = () => {
  isYikawaListExpanded.value = !isYikawaListExpanded.value
}

/** ========== 自嘲熊 ========== */
// 將 naganoList 改為計算屬性
const naganoList = computed(() => [
  {
    id: 1,
    key: 'polar_bear',
    name: t('nagano_characters.polar_bear')
  },
  {
    id: 2,
    key: 'croquette',
    name: t('nagano_characters.croquette')
  },
  {
    id: 3,
    key: 'sausage',
    name: t('nagano_characters.sausage')
  },
  {
    id: 4,
    key: 'pug',
    name: t('nagano_characters.pug')
  },
  {
    id: 5,
    key: 'others',
    name: t('nagano_characters.others')
  }
])

const currentNaganoKeyword = computed(() => {
  return (route.query.keyword as string) || 'polar_bear'
})

const isNaganoListExpanded = ref(false) // 控制列表展開/收合的狀態

const toggleNaganoList = () => {
  isNaganoListExpanded.value = !isNaganoListExpanded.value
}
</script>

<template>
  <div class="sticky top-0 z-20 border-b-[3px] border-black bg-white py-3">
    <div class="relative m-auto flex max-w-[1200px] items-center justify-between px-6">
      <nuxtLink to="/" class="text-[22px]">新吉伊卡哇鑑定站</nuxtLink>

      <div class="flex items-center justify-center gap-4">
        <button
          class="flex h-12 w-12 items-center justify-center"
          @click="showSidebar = !showSidebar"
        >
          <Icon name="ph:list-magnifying-glass" class="text-black" size="32" />
        </button>

        <!-- member menu -->
        <Transition name="fade">
          <div
            class="fixed inset-0 top-[75px] z-[200] bg-black bg-opacity-20"
            v-show="showSidebar"
            @click.self="showSidebar = false"
          >
            <Transition
              name="slide"
              enter-active-class="transition-all duration-300 ease-out"
              leave-active-class="transition-all duration-300 ease-in"
            >
              <div class="left-bar h-full w-[300px] bg-white" v-show="showSidebar">
                <div class="flex flex-col p-3">
                  <!-- * 吉伊卡哇角色清單 -->
                  <div class="flex flex-col">
                    <div
                      class="flex cursor-pointer items-center justify-between py-2"
                      @click="toggleList"
                    >
                      <span class="text-lg font-semibold">{{
                        t('title.yikawa_identification')
                      }}</span>
                      <Icon
                        name="ph:plus"
                        class="text-black transition-transform duration-300"
                        :class="{ 'rotate-45': isYikawaListExpanded }"
                        size="24"
                      />
                    </div>

                    <Transition name="expand">
                      <div v-show="isYikawaListExpanded" class="overflow-hidden">
                        <NuxtLink
                          v-for="item in yikawaList"
                          :key="item.id"
                          :to="`/?keyword=${item.key}`"
                          class="sidebar-item"
                          :class="{ 'sidebar-item-active': currentKeyword === item.key }"
                        >
                          <Icon name="ph:star" class="text-black" size="10" />
                          <span>{{ item.name }}</span>
                        </NuxtLink>
                      </div>
                    </Transition>
                  </div>

                  <hr class="my-4 border-[#cfcfcf]" />

                  <!-- * 自嘲熊角色清單 -->
                  <div class="flex flex-col">
                    <div
                      class="flex cursor-pointer items-center justify-between py-2"
                      @click="toggleNaganoList"
                    >
                      <span class="text-lg font-semibold">{{
                        t('title.chiikawa_identification')
                      }}</span>
                      <Icon
                        name="ph:plus"
                        class="text-black transition-transform duration-300"
                        :class="{ 'rotate-45': isNaganoListExpanded }"
                        size="24"
                      />
                    </div>

                    <Transition name="expandNagano">
                      <div v-show="isNaganoListExpanded" class="overflow-hidden">
                        <NuxtLink
                          v-for="item in naganoList"
                          :key="item.id"
                          :to="`/?keyword=${item.key}`"
                          class="sidebar-item"
                          :class="{ 'sidebar-item-active': currentNaganoKeyword === item.key }"
                        >
                          <Icon name="ph:star" class="text-black" size="10" />
                          <span>{{ item.name }}</span>
                        </NuxtLink>
                      </div>
                    </Transition>
                  </div>

                  <hr class="my-4 border-[#cfcfcf]" />

                  <!-- * 公告欄 -->
                  <NuxtLink
                    to="/announcement"
                    class="sidebar-page"
                    exact-active-class="sidebar-item-active"
                  >
                    <Icon name="ph:newspaper" class="text-black" size="26" />
                    <span>
                      {{ t('title.announcement') }}
                    </span>
                  </NuxtLink>

                  <!-- * 買娃地圖 -->
                  <NuxtLink
                    to="/shopMap"
                    class="sidebar-page"
                    exact-active-class="sidebar-item-active"
                  >
                    <Icon name="ph:map-pin" class="text-black" size="26" />
                    <span>
                      {{ t('title.buy_doll_map') }}
                    </span>
                  </NuxtLink>

                  <hr class="my-4 border-[#cfcfcf]" />

                  <!-- * 切換語言 -->
                  <div class="flex items-center gap-4">
                    <button
                      class="language-button"
                      :class="{ active: locale === 'zh-TW' }"
                      @click="locale = 'zh-TW'"
                    >
                      中
                    </button>
                    <button
                      class="language-button"
                      :class="{ active: locale === 'jp' }"
                      @click="locale = 'jp'"
                    >
                      日
                    </button>
                    <button
                      class="language-button"
                      :class="{ active: locale === 'en' }"
                      @click="locale = 'en'"
                    >
                      En
                    </button>
                  </div>

                  <hr class="my-4 border-[#cfcfcf]" />

                  <div class="flex gap-1 text-gray-600">
                    <NuxtLink to="/contact" class="cus-hover">{{ t('title.contact') }}</NuxtLink>
                    ·
                    <NuxtLink to="/commonSites" class="cus-hover">{{
                      t('title.common_sites')
                    }}</NuxtLink>
                    ·
                    <!-- * DC 連結 -->
                    <a href="https://discord.gg/dhzzb8dG" target="_blank" class="cus-hover"
                      >Discord</a
                    >
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-item {
  @apply transform px-[52px] py-2 duration-300;
}

.menu-item:hover {
  background: #efece7;
}

.double-bg::after {
  @apply absolute left-[2px] top-[2px] h-[296px] w-[188px] border-2 border-black bg-white lg:h-[128px];
  content: '';
  z-index: -1;
}

/* 側選單 滾動條隱藏 */
.left-bar {
  @apply absolute right-0 overflow-y-scroll;
  /* Firefox */
  scrollbar-width: none;
  /* IE and Edge */
  -ms-overflow-style: none;
}

/* Chrome, Safari and Opera */
.left-bar::-webkit-scrollbar {
  display: none;
}

.sidebar-item {
  @apply flex transform items-center gap-3 rounded-[10px] px-3 py-2.5 font-bold duration-300 hover:bg-yellow-500/25;
}

.sidebar-item-active {
  @apply bg-yellow-500/25 text-black;
}
.sidebar-item-icon {
  @apply h-8 w-8;
}

.sidebar-page {
  @apply flex transform items-center gap-3 rounded-[10px] px-3 py-2.5 font-bold duration-300 hover:bg-yellow-500/25;
}

/* 側選單 背景遮罩 動畫 */
.fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-leave-active {
  transition: opacity 0.5s ease;
  /* transition-delay: 0.3s; */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 側選單 動畫 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(450px);
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}

/* 展開/收合動畫 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 1000px; /* 設置一個足夠大的高度 */
}

/* 展開/收合動畫 */
.expandNagano-enter-active,
.expandNagano-leave-active {
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}

.expandNagano-enter-from,
.expandNagano-leave-to {
  opacity: 0;
  max-height: 0;
}

.expandNagano-enter-to,
.expandNagano-leave-from {
  opacity: 1;
  max-height: 300px; /* 設置一個足夠大的高度 */
}

/* 切換語言按鈕 */
.language-button {
  @apply h-10 w-10 rounded-full border-2 border-transparent bg-yellow-500/25 px-2 py-1 text-black transition-all duration-200;
}

.language-button:hover {
  @apply font-semibold;
}

.language-button.active {
  @apply border-black font-semibold;
}
</style>
