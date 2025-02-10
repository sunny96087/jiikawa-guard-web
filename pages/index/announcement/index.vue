<!-- announcement -->
<script setup lang="ts">
import type { apiResponse } from '~/models'
import { APIStore } from '~/store/apiService'
const store = APIStore()
import { showToast, openDialog, showLoading, hideLoading } from '~/store/eventBus'

const currentSort = ref(0)
const tagOption = ['所有', '公告', '功能', '其他']
const currentTag = ref('所有')
const currentKeyword = ref('')
const list: any = ref([])

onMounted(() => {
    loadData()
})

async function loadData() {

    let data: any = {
        sort: currentSort.value === 0 ? '' : 'oldest',
        keyword: currentKeyword.value,
        tag: currentTag.value === '所有' ? '' : currentSort.value
    }

    console.log(data);
    try{
        showLoading()
        const res = await store.apiGetAnnouncements(data)
        const result = res.data
        console.log(`result = ${JSON.stringify(result)}`)
        if (result.statusCode === 200) {
            list.value = result.data
            console.log(`list = ${JSON.stringify(list)}`)
        } else {
            console.log('取得公告列表失敗')
        }
    } catch (e) {
    console.log(e)
  } finally {
    hideLoading()
  }
    
}
</script>
<template>
    <div>
        123
    </div>
</template>