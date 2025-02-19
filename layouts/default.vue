<script setup lang="ts">
import { APIStore } from '~/store/apiService'
const store = APIStore()

const route = useRoute()
// 判斷是否在 contribute 頁面
const hideNavbar = computed(() => {
  return route.path === '/contribute'
})

const isContributePage = computed(() => {
  return route.path === '/contribute'
})
</script>

<template>
  <main class="relative min-h-screen w-full">
    <NewNavbar v-if="!hideNavbar" />
    <div class="page-wrapper">
      <div class="grow">
        <NuxtPage />
      </div>
      <Slidebar v-if="store.isLoggedIn" />
    </div>
    <Footer />

    <!-- * 提示網站尚未完成 -->
    <div
      v-if="!isContributePage"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-black/60 p-4 text-center font-bold text-white backdrop-blur-[6px]"
    >
      <p class="text-xl">網站尚未完成，目前還在收集資料階段，請不要亂跑 ><</p>
      <NuxtLink to="/contribute" class="custom-btn-primary">我要提供資料</NuxtLink>
    </div>
  </main>
</template>
<style scoped>
main {
  background: url('~/assets/images/bg.png') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
  font-family: 'Azeret Mono';
}

.page-wrapper {
  max-width: 1200px;
  width: 100%;
  min-height: 82vh;
  margin: 0 auto;
  display: flex;
  gap: 28px;
  padding: 40px 24px;
  padding-bottom: 60px;
  align-items: start;
}
</style>
