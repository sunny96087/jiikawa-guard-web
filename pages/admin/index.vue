<script setup lang="ts">
definePageMeta({
  layout: false
  // middleware: 'is-admin'
})

const router = useRouter()

/** 檢查 是否登入 */

const userInfo = ref<any>(null)

onMounted(() => {
  userInfo.value = localStorage.getItem('userInfo')
  console.log(userInfo.value)

  // || !userInfo.value.isAdmin // 還沒設定管理員欄位，所以先不加
  if (!userInfo.value) {
    router.push('/adminLogin')
  }
})
</script>

<template>
  <main class="bg relative min-h-screen w-full">
    <admin-navbar />
    <div class="page-wrapper">
      <div class="grow">
        <!-- <NuxtPage class="custom-b-shadow mt-4 rounded-lg border-2 border-black bg-white"/> -->
        <NuxtPage />
      </div>
    </div>
  </main>
  <ToastTool />
</template>

<style scoped>
.page-wrapper {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  gap: 28px;
  padding: 40px 24px;
  padding-bottom: 60px;
  align-items: start;
}

.bg {
  background: url('~/assets/images/admin-bg.png') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
  font-family: 'Azeret Mono';
}
</style>
