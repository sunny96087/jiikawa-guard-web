// 支持的語言配置
export const SUPPORTED_LANGUAGES = {
  'zh-TW': '繁體中文',
  jp: '日文',
  en: '英文'
} as const

export const DEFAULT_LANGUAGE = 'zh-TW'

// 定義支持的語言類型
export type SupportedLocale = keyof typeof SUPPORTED_LANGUAGES
