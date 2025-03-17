import { useI18n } from 'vue-i18n'

// 吉伊卡哇角色列表
export const roleList = [
  { id: 0, key: 'all_chiikawa', name: 'yikawa.all' },
  { id: 1, key: 'chiikawa', name: 'yikawa.chiikawa' },
  { id: 2, key: 'hachiware', name: 'yikawa.hachiware' },
  { id: 3, key: 'usagi', name: 'yikawa.usagi' },
  { id: 4, key: 'momonga', name: 'yikawa.momonga' },
  { id: 5, key: 'kurimanjuu', name: 'yikawa.kurimanjuu' },
  { id: 6, key: 'rakko', name: 'yikawa.rakko' },
  { id: 7, key: 'shisa', name: 'yikawa.shisa' },
  { id: 8, key: 'kani', name: 'yikawa.kani' },
  { id: 9, key: 'ano_ko', name: 'yikawa.ano_ko' },
  { id: 10, key: 'daistrong', name: 'yikawa.daistrong' },
  { id: 11, key: 'sou', name: 'yikawa.sou' },
  { id: 12, key: 'chimera', name: 'yikawa.chimera' },
  { id: 13, key: 'yoroisan', name: 'yikawa.yoroisan' },
  { id: 14, key: 'kabutomushi', name: 'yikawa.kabutomushi' },
  { id: 15, key: 'yousei', name: 'yikawa.yousei' },
  { id: 16, key: 'hoshi', name: 'yikawa.hoshi' },
  { id: 17, key: 'others_chiikawa', name: 'yikawa.others' }
]

// 長野角色列表
export const naganoRoleList = [
  { id: 0, key: 'all_nagano', name: 'nagano_characters.all' },
  { id: 1, key: 'polar_bear', name: 'nagano_characters.polar_bear' },
  { id: 2, key: 'croquette', name: 'nagano_characters.croquette' },
  { id: 3, key: 'sausage', name: 'nagano_characters.sausage' },
  { id: 4, key: 'pug', name: 'nagano_characters.pug' },
  { id: 5, key: 'others_nagano', name: 'nagano_characters.others' }
]

// 系列列表
export const seriesList = [
  { id: 0, key: 'all', name: 'yikawa_series.all' },
  { id: 1, key: 'yomiuri_giants', name: 'yikawa_series.yomiuri_giants' },
  { id: 2, key: 'soft_plush', name: 'yikawa_series.soft_plush' },
  { id: 3, key: 'cafe', name: 'yikawa_series.cafe' },
  { id: 4, key: 'chiikawa_land', name: 'yikawa_series.chiikawa_land' },
  { id: 5, key: 'mogumogu', name: 'yikawa_series.mogumogu' },
  { id: 6, key: 'nagano_market', name: 'yikawa_series.nagano_market' },
  { id: 7, key: 'ichiban_kuji', name: 'yikawa_series.ichiban_kuji' },
  { id: 8, key: 'rairai_dining', name: 'yikawa_series.rairai_dining' },
  { id: 9, key: 'winter_scarf', name: 'yikawa_series.winter_scarf' },
  { id: 10, key: 'outing', name: 'yikawa_series.outing' },
  { id: 11, key: 'basic', name: 'yikawa_series.basic' },
  { id: 12, key: 'sushi', name: 'yikawa_series.sushi' },
  { id: 13, key: 'angel_devil', name: 'yikawa_series.angel_devil' },
  { id: 14, key: 'parallel_world', name: 'yikawa_series.parallel_world' },
  { id: 15, key: 'hero_collab', name: 'yikawa_series.hero_collab' },
  { id: 16, key: 'travel', name: 'yikawa_series.travel' },
  { id: 17, key: 'tokyo_station', name: 'yikawa_series.tokyo_station' },
  { id: 18, key: 'forest_mushroom', name: 'yikawa_series.forest_mushroom' },
  { id: 19, key: 'fluffy_grass', name: 'yikawa_series.fluffy_grass' },
  { id: 20, key: 'aquarium', name: 'yikawa_series.aquarium' },
  // { id: 21, key: 'unspecified', name: 'yikawa_series.unspecified' },
  { id: 22, key: 'birthday', name: 'yikawa_series.birthday' },
  { id: 23, key: 'pajama_party', name: 'yikawa_series.pajama_party' },
  { id: 24, key: 'christmas', name: 'yikawa_series.christmas' },
  { id: 25, key: 'halloween', name: 'yikawa_series.halloween' },
  { id: 26, key: 'express_delivery', name: 'yikawa_series.express_delivery' },
  { id: 27, key: 'amusement_park', name: 'yikawa_series.amusement_park' },
  { id: 28, key: 'hankyu_train', name: 'yikawa_series.hankyu_train' },
  { id: 29, key: 'shisa_festival', name: 'yikawa_series.shisa_festival' },
  { id: 30, key: 'restaurant', name: 'yikawa_series.restaurant' },
  { id: 31, key: 'magical_girl', name: 'yikawa_series.magical_girl' },
  { id: 32, key: 'bakery', name: 'yikawa_series.bakery' },
  { id: 33, key: 'limited_edition', name: 'yikawa_series.limited_edition' },
  { id: 34, key: 'mlb', name: 'yikawa_series.mlb' },
  { id: 35, key: 'others', name: 'yikawa_series.others' }
]

// 分類列表
export const categoryList = [
  { id: 0, key: 'all', name: 'yikawa_categories.all' },
  { id: 1, key: 'plush', name: 'yikawa_categories.plush' },
  { id: 2, key: 'keychain', name: 'yikawa_categories.keychain' },
  { id: 3, key: 'cushion', name: 'yikawa_categories.cushion' },
  { id: 4, key: 's_shape', name: 'yikawa_categories.s_shape' },
  // { id: 5, key: 'tapestry', name: 'yikawa_categories.tapestry' },
  { id: 6, key: 'others', name: 'yikawa_categories.others' }
]

// 狀態列表
export const statusList = [
  { id: 0, key: 'all', name: 'yikawa_status.all' },
  { id: 1, key: '1', name: 'yikawa_status.show' },
  { id: 2, key: '0', name: 'yikawa_status.hide' }
]

// 圖片類型列表
export const imageTypeList = [
  { id: 0, key: 1, name: 'image_type.official' },
  { id: 1, key: 2, name: 'image_type.counterfeit' },
  { id: 2, key: 3, name: 'image_type.comparison' }
]

// 添加 ListItem 類型定義
export interface ListItem {
  id: number
  key: string
  name: string
}
