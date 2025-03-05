<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
  maxDisplayPages?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxDisplayPages: 5
})

const emit = defineEmits<{
  (e: 'update:page', page: number): void
}>()

// 計算要顯示的頁碼
const displayedPages = computed(() => {
  const totalPages = props.totalPages
  const currentPage = props.currentPage
  const pages: (number | string)[] = []

  if (totalPages <= props.maxDisplayPages) {
    // 如果總頁數小於等於最大顯示頁數，直接顯示所有頁碼
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // 總是顯示第一頁
    pages.push(1)

    if (currentPage <= 3) {
      // 當前頁在前面
      pages.push(2, 3, 4, '...', totalPages)
    } else if (currentPage >= totalPages - 2) {
      // 當前頁在後面
      pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      // 當前頁在中間
      pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
    }
  }

  return pages
})

// 處理頁碼變更
const handlePageChange = (page: number) => {
  // 如果是同一頁，不進行跳轉
  if (page === props.currentPage) return
  if (page < 1 || page > props.totalPages) return
  emit('update:page', page)
}
</script>

<template>
  <div class="flex items-center justify-center gap-2">
    <!-- {{ currentPage }} {{ displayedPages }} -->
    <!-- 上一頁 -->
    <button
      class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition-all duration-200"
      :class="{
        'cursor-not-allowed opacity-50': currentPage === 1,
        'hover:border-blue-500 hover:text-blue-500': currentPage !== 1
      }"
      :disabled="currentPage === 1"
      @click="handlePageChange(currentPage - 1)"
    >
      <Icon name="material-symbols:chevron-left" size="24" />
    </button>

    <!-- 頁碼 -->
    <template v-for="page in displayedPages" :key="page">
      <button
        v-if="page !== '...'"
        class="flex h-10 min-w-[2.5rem] items-center justify-center rounded-lg border border-gray-300 px-2 font-medium transition-all duration-200"
        :class="{
          'border-primary6 bg-primary6 text-white': page === currentPage,
          'bg-white text-gray-600 hover:border-primary6 hover:text-primary6': page !== currentPage
        }"
        @click="handlePageChange(Number(page))"
      >
        {{ page }}
      </button>
      <span v-else class="flex h-10 w-10 items-center justify-center text-gray-500"> ••• </span>
    </template>

    <!-- 下一頁 -->
    <button
      class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition-all duration-200"
      :class="{
        'cursor-not-allowed opacity-50': currentPage === totalPages,
        'hover:border-blue-500 hover:text-blue-500': currentPage !== totalPages
      }"
      :disabled="currentPage === totalPages"
      @click="handlePageChange(currentPage + 1)"
    >
      <Icon name="material-symbols:chevron-right" size="24" />
    </button>
  </div>
</template>

<style scoped></style>
