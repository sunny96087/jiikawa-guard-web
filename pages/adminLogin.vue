<script setup lang="ts">
import { APIStore } from '~/store/apiService'
const store = APIStore()
import { showToast } from '~/store/eventBus'

const router = useRouter()

// 登入表單資料
const loginForm = ref({
  email: '',
  password: ''
})

// 載入狀態
const isLoading = ref(false)

// 登入處理
const handleLogin = async () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    showToast('請填寫完整的登入資訊')
    return
  }

  try {
    isLoading.value = true
    // 這裡替換成您的登入 API
    const res: any = await store.apiAdminLogin(loginForm.value)
    const result = res.data

    if (result.statusCode === 200) {
      store.saveUserDataToLocalStorage({
        token: result.user.token,
        id: result.user.id,
        name: result.user.name,
        googleId: result.user.googleId,
        avatar: result.user.avatar,
        isAdmin: result.user.isAdmin
      })

      showToast('登入成功！')
      router.push('/admin/')
    } else {
      showToast('帳號或密碼錯誤，請重新輸入！')
    }
  } catch (error) {
    showToast('登入失敗，請檢查帳號密碼是否正確')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="bg flex min-h-screen items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- 登入卡片 -->
      <div class="rounded-2xl border-2 border-black p-8 shadow-lg">
        <!-- 標題區 -->
        <div class="mb-8 text-center">
          <h1 class="mb-2 text-2xl font-bold">新版吉伊卡哇鑑定網</h1>
          <p class="text-gray-600">Admin Login</p>
        </div>

        <!-- 登入表單 -->
        <div class="space-y-6">
          <!-- 電子郵件 -->
          <div>
            <label for="email" class="mb-2 block font-medium">帳號</label>
            <input
              id="email"
              v-model="loginForm.email"
              type="email"
              class="custom-input"
              placeholder="請輸入帳號"
              required
            />
          </div>

          <!-- 密碼 -->
          <div>
            <label for="password" class="mb-2 block font-medium">密碼</label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              class="custom-input"
              placeholder="請輸入密碼"
              required
            />
          </div>

          <!-- 登入按鈕 -->
          <button
            type="submit"
            class="custom-btn-primary w-full"
            :disabled="isLoading"
            @click="handleLogin"
          >
            <span v-if="!isLoading">登入</span>
            <span v-else class="flex items-center justify-center gap-2">
              <Icon name="ph:circle-notch" class="animate-spin" />
              登入中...
            </span>
          </button>
        </div>

        <!-- 返回首頁 -->
        <div class="mt-6 text-center">
          <NuxtLink to="/" class="text-sm text-gray-600 hover:text-yellow-600">
            <Icon name="ph:arrow-left" class="mr-1" />
            返回首頁
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg {
  background: url('~/assets/images/bg.png') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
  font-family: 'Azeret Mono';
}
</style>
