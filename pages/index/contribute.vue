<script setup lang="ts">
import { APIStore } from '~/store/apiService'

const store = APIStore()

import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

const exampleFormat = ref(`【角色】：兔兔
【系列】：龍年
【分類】：S娃
【圖源名稱】：2魚
【商品來源】：蝦皮
【提供的資料類型】：正版盜版比對圖
----- 實際案例說明 -----
這是一個範例案例，以下是我的檢查重點：
1. 吊牌字體有明顯問題
2. 車縫線不夠細緻
3. 商品重量偏輕

※ 已附上六面拍攝照片，並將可疑處用紅圈標示。`)

const supportFormat = ref(`【角色】：
【系列】：
【分類】：(吊飾、S娃、M娃、扭蛋盲盒公仔、卡片、其他可自行填寫)
【圖源名稱】：(您希望放在圖片上的名稱或綽號)
【商品來源】：(蝦皮、日拍、臉書、實體店名稱、其他可自行填寫)
【提供的資料類型】：(正版盜版比對圖、確定是正版圖片、確定是盜版圖片、其他可自行填寫)

----- 圖片拍攝說明 -----

※ 目前僅接受自己拍攝的照片，請勿使用網路圖片！

【正版 & 盜版商品】請拍攝以下 6 個面：
1. 正面
2. 背面
3. 左側
4. 右側
5. 頭頂
6. 底部

【有盜版疑慮的商品】除了上述六個面外：
• 請額外拍攝您覺得可疑的部分
• 在照片上圈選標示可疑之處
• 說明您認為可疑的原因`)

const copyFormat = () => {
  navigator.clipboard.writeText(supportFormat.value)
  // 可以加入複製成功的提示
}
</script>

<template>
  <div class="m-auto max-w-[800px] p-6">
    <!-- 標題區 -->
    <h1 class="mb-8 text-center text-2xl font-bold">
      新版吉伊卡哇真偽鑒定網站需要你們的大力支援 ✨
    </h1>

    <!-- 說明區 -->
    <div class="mb-8 space-y-4 text-lg">
      <p>親愛的各位吉友們，為了讓這個鑒定網站能夠更好地為大家服務，我們需要您的幫助！</p>
      <p>
        如果您手上有任何正版或疑似仿冒的吉伊卡哇商品，都歡迎提供給我們。您的分享將幫助更多人辨識商品真偽，避免買到仿冒品。
      </p>
      <p>吉伊卡哇 & 自嘲熊的任何商品都可以提供歐!</p>
      <p>我們會將您提供的資料進行審核，整理後會放到網站上。</p>
      <p>如果您有任何問題，歡迎隨時聯絡我們。</p>
    </div>

    <!-- 範例區 -->
    <div class="mb-8 rounded-xl border-2 border-yellow-500/50 bg-yellow-500/10 p-6">
      <h2 class="mb-4 text-xl font-bold">填寫範例</h2>
      <div class="whitespace-pre-wrap rounded-lg bg-white/50 p-4 font-sans">
        <p>【角色】：兔兔</p>
        <p>【系列】：龍年</p>
        <p>【分類】：S娃</p>
        <p>【圖源名稱】：2魚</p>
        <p>【商品來源】：蝦皮</p>
        <p>【提供的資料類型】：正版盜版比對圖</p>

        <hr class="col-span-2 my-2 border-yellow-500/50" />

        <p class="mb-2 text-[18px] font-bold text-red-500">※ 可疑處用紅圈標示以及文字描述</p>
        <div class="grid grid-cols-2 gap-4">
          <p class="col-span-2">1. 吊牌文字：「販售禁止」字型差異</p>
          <p>盜版</p>
          <p>正版</p>
          <img src="~/assets/images/contribute/ex1-bad.png" alt="盜版" />
          <img src="~/assets/images/contribute/ex1.png" alt="正版" />
          <hr class="col-span-2 my-2 border-yellow-500/50" />
          <p class="col-span-2">2. 頭頂縫線不整齊</p>
          <p>盜版</p>
          <p>正版</p>
          <img src="~/assets/images/contribute/ex2-bad.png" alt="盜版" />
          <img src="~/assets/images/contribute/ex2.png" alt="正版" />
          <hr class="col-span-2 my-2 border-yellow-500/50" />
          <p class="col-span-2">3. 臉看起來怪怪的</p>
          <p>盜版</p>
          <p>正版</p>
          <img src="~/assets/images/contribute/ex3-bad.png" alt="盜版" />
          <img src="~/assets/images/contribute/ex3.png" alt="正版" />
          <hr class="col-span-2 my-2 border-yellow-500/50" />
          <p class="col-span-2">4. 標籤文字不同</p>
          <p>盜版</p>
          <p>正版</p>
          <img src="~/assets/images/contribute/ex4-bad.png" alt="盜版" />
          <img src="~/assets/images/contribute/ex4.png" alt="正版" />
        </div>
        <hr class="my-4" />

        <p>※ 附上六面拍攝照片或手上有的照片都可以</p>
        <p>
          (上面圈起來的照片可以給我沒有標記的原圖，這樣我整理跟審核後可以讓整個網站的範例統一且整齊)
        </p>
        <p>※ 信件內可以直接丟全部圖，也可以帶壓縮檔</p>
      </div>
    </div>

    <!-- 格式區 -->
    <div class="border-primary4 bg-primary1/40 mb-8 rounded-xl border-2 p-6">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-bold">提供格式（點擊右側按鈕可複製）</h2>
        <button
          @click="copyFormat"
          class="bg-primary3 hover:bg-primary4 flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all"
        >
          <Icon name="ph:copy" size="20" />
          複製格式
        </button>
      </div>
      <pre class="whitespace-pre-wrap rounded-lg bg-gray-300/30 p-4 font-sans">{{
        supportFormat
      }}</pre>
    </div>

    <!-- 提供資料的方式 -->
    <div class="mb-8">
      <h2 class="mb-4 text-xl font-bold">提供資料的方式</h2>
      <div class="grid grid-cols-2 gap-4">
        <a
          href="mailto:yu13142013@gmail.com?subject=吉伊卡哇真偽鑒定資料提供"
          class="border-primary6 text-primary6 hover:bg-primary1 cus-hover flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-[18px] font-medium"
        >
          <Icon name="ph:envelope" size="24" />
          寄信給我
        </a>
        <a
          href="https://www.facebook.com/sunny.uy.9/"
          target="_blank"
          class="border-primary6 text-primary6 hover:bg-primary1 cus-hover flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-[18px] font-medium"
        >
          <Icon name="ph:facebook-logo" size="24" />
          FB 私訊我
        </a>
      </div>
    </div>

    <!-- 感謝詞 -->
    <div class="text-center text-lg">
      <p>感謝您的支持與協助！</p>
      <p>讓我們一起維護一個更好的吉伊卡哇收藏環境 ❤️</p>
      <br />
      <p>
        歡迎加入我們的
        <a href="https://discord.gg/dhzzb8dG" target="_blank" class="text-primary6">Discord 群組</a>
        一起討論吉伊卡哇！
      </p>
    </div>
  </div>
</template>

<style scoped>
pre {
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}
</style>
