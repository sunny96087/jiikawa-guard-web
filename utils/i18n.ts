// 引入必要的依賴
import { createI18n } from 'vue-i18n'
import { defineNuxtPlugin } from 'nuxt/app'
import { useI18n } from 'vue-i18n'
// 引入語言包
import zhTW from '~/locales/zh_TW.json'
// import th from '../locales/th.json'
import en from '~/locales/en.json'
import jp from '~/locales/ja.json'
// 引入i18n配置
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, type SupportedLocale } from './i18n-config'

const LANGUAGE_STORAGE_KEY = 'taiwakuji_userLanguage'

/**
 * 日誌記錄相關函數
 */
// 記錄一般信息
const logInfo = (message: string, ...args: any[]) => {
  console.log(`[i18n] ${message}`, ...args)
}

// 記錄錯誤信息
const logError = (message: string, error?: any) => {
  console.error(`[i18n Error] ${message}`, error)
}

/**
 * 獲取瀏覽器語言設置
 * @returns {SupportedLocale} 返回支持的語言代碼
 */
function getBrowserLanguage(): SupportedLocale {
  try {
    // 檢查是否在服務器端
    if (typeof navigator === 'undefined') {
      return DEFAULT_LANGUAGE
    }

    // const browserLang = navigator.language
    const browserLang = navigator.language

    // 定義語言映射關係
    const languageMap: Record<string, SupportedLocale> = {
      'zh-TW': 'zh-TW', // 繁體中文(台灣)
      'zh-HK': 'zh-TW', // 繁體中文(香港)
      zh: 'zh-TW',
      // th: 'th', // 泰文
      // 'th-TH': 'th', // 泰文(泰國)
      en: 'en', // 英文
      'en-usen-gb': 'en', // 英文
      'en-au': 'en', // 英文
      'en-ca': 'en', // 英文
      'en-nz': 'en', // 英文
      'en-za': 'en', // 英文
      'en-jm': 'en',
      'en-bz': 'en',
      'en-tt': 'en',
      jp: 'jp'
    }

    console.log('Browser language:', browserLang) // 添加這行來偵錯
    const selectedLang = languageMap[browserLang] || DEFAULT_LANGUAGE
    console.log('Selected language:', selectedLang) // 添加這行來偵錯
    return selectedLang
  } catch (error) {
    logError('獲取瀏覽器語言失敗', error)
    return DEFAULT_LANGUAGE
  }
}

/**
 * 設置HTML文檔的語言屬性
 * @param {string} lang - 語言代碼
 */
function setHtmlLang(lang: string): void {
  try {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
    }
  } catch (error) {
    logError('設置 HTML lang 屬性失敗', error)
  }
}

/**
 * 從 localStorage 獲取已保存的語言設定
 */
function getSavedLanguage(): SupportedLocale | null {
  try {
    if (process.client) {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
      return (saved as SupportedLocale) || null
    }
    return null
  } catch (error) {
    logError('獲取已保存的語言設定失敗', error)
    return null
  }
}

/**
 * 保存語言設定到 localStorage
 */
function saveLanguagePreference(lang: SupportedLocale): void {
  try {
    if (process.client) {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
    }
  } catch (error) {
    logError('保存語言偏好失敗', error)
  }
}

/**
 * 獲取初始語言設定
 */
function getInitialLanguage(): SupportedLocale {
  // 優先使用已保存的語言設定
  const savedLanguage = getSavedLanguage()
  if (savedLanguage && savedLanguage in SUPPORTED_LANGUAGES) {
    return savedLanguage
  }
  // 如果沒有已保存的設定，則使用瀏覽器語言
  return getBrowserLanguage()
}

export function useLanguageSwitch() {
  const { locale } = useI18n()

  function switchLanguage(lang: SupportedLocale) {
    try {
      if (lang in SUPPORTED_LANGUAGES) {
        locale.value = lang
        setHtmlLang(lang)
        // 保存語言偏好
        saveLanguagePreference(lang)
      } else {
        throw new Error(`不支持的語言: ${lang}`)
      }
    } catch (error) {
      logError('語言切換失敗', error)
    }
  }

  return {
    switchLanguage,
    currentLocale: locale,
    supportedLanguages: SUPPORTED_LANGUAGES
  }
}

/**
 * Nuxt插件主入口
 * 初始化i18n配置並將其注入到Vue應用中
 */
export default defineNuxtPlugin(({ vueApp }) => {
  // 使用 getInitialLanguage 替代直接調用 getBrowserLanguage
  const selectedLocale = getInitialLanguage()

  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: selectedLocale,
    fallbackLocale: DEFAULT_LANGUAGE,
    messages: {
      'zh-TW': zhTW,
      zh: zhTW,
      en,
      jp
    }
  })

  // 確保在客戶端執行
  if (process.client) {
    // 立即設置初始語言
    setHtmlLang(selectedLocale)

    // 監聽語言變化
    watch(
      () => i18n.global.locale.value,
      (newLocale) => {
        setHtmlLang(newLocale)
      },
      { immediate: true }
    )
  }

  // 將i18n插件安裝到Vue應用
  vueApp.use(i18n)
})
