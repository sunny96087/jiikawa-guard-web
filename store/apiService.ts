import type { JsonObject } from 'type-fest'
import { defineStore } from 'pinia'
import axios from 'axios'

// const obj: JsonObject = {
//   name: 'John',
//   age: 30
// }

export const APIStore = defineStore({
  id: 'api-store',
  state: () => {
    return {
      // 開發
      api: 'http://localhost:3666/',

      // 線上
      // api: 'https://express-community.onrender.com/',
      // api: 'https://jiikawa-guard-api.onrender.com/',

      //   userInfo: null as JsonObject | null,
      //   tokenInfo: {
      //     token: '',
      //   }
      userInfo: null as any | null, // 用戶資料，初始為 null
      isLoggedIn: false // 登入狀態
    }
  },
  actions: {
    // todo 文章 posts

    // 取得所有文章
    async apiGetPost(data: JsonObject) {
      try {
        return await axios.get(
          `${this.api}posts?sort=${data.sort}&keyword=${data.keyword}&userId=${data.userId ? data.userId : ''}`
        )
      } catch (e) {
        console.log(`apiGetPost error`, e)
        return e
      }
    },
    // 新增單筆文章
    async apiAddPost(data: JsonObject) {
      try {
        const user = await this.userInfo.token
        console.log(`token = ${user}`)
        return await axios.post(`${this.api}posts`, data, {
          headers: {
            token: user
          }
        })
      } catch (e) {
        console.log(`apiAddPost error`, e)
        return e
      }
    },
    // 新增單筆文章留言
    async apiAddPostComment(data: JsonObject) {
      try {
        return await axios.post(`${this.api}posts/comments/${data.postId}`, data)
      } catch (e) {
        console.log(`apiAddPostComment error`, e)
        return e
      }
    },
    // 指定文章按讚
    async apiLikePost(data: JsonObject) {
      try {
        return await axios.patch(`${this.api}posts/like/${data.postId}`, data)
      } catch (e) {
        console.log(`apiAddPostComment error`, e)
        return e
      }
    },

    // todo 使用者 users

    // 取得單筆使用者資料 自己
    async apiGetSpecifyUser() {
      const user = await this.getToken()
      console.log(`token = ${user}`)
      return await axios.get(`${this.api}users/userOne`, {
        headers: {
          token: user
        }
      })
    },
    // 取得單筆使用者資料 公開
    async apiGetSpecifyOpenUser(data: JsonObject) {
      try {
        console.log(data)

        return await axios.get(`${this.api}users/userOneOpen/${data.id}`)
      } catch (e) {
        console.log(`apiGetSpecifyUser error`, e)
        return e
      }
    },
    // 取得使用者按讚文章資料
    async apiGetUserLikePost(data: JsonObject) {
      return await axios.get(`${this.api}users/likedPosts/${data}`)
    },
    // 修改使用者資料 自己
    async apiUpdateUser(data: JsonObject) {
      const user = await this.userInfo.token
      console.log(`token = ${user}`)
      return await axios.patch(`${this.api}users/`, data, {
        headers: {
          token: user
        }
      })
    },
    // 重設密碼
    async apiUpdatePassword(data: JsonObject) {
      const user = await this.userInfo.token
      console.log(`token = ${user}`)
      return await axios.post(`${this.api}users/updatePassword`, data, {
        headers: {
          token: user
        }
      })
    },

    // 取得使用者蹤清單 自己
    async apiGetUserFollowList() {
      try {
        const user = await this.userInfo.token
        console.log(`token = ${user}`)
        return await axios.get(`${this.api}users/followList`, {
          headers: {
            token: user
          }
        })
      } catch (e) {
        console.log(`apiGetUserFollowList error`, e)
        return e
      }
    },
    // 追蹤
    async apiFollowUser(data: JsonObject) {
      const user = await this.userInfo.token
      console.log(`token = ${user}`)
      return await axios.patch(
        `${this.api}users/follow/${data}`,
        {},
        {
          headers: {
            token: user
          }
        }
      )
    },
    // 註冊
    async apiRegister(data: JsonObject) {
      try {
        return await axios.post(`${this.api}users/sign_up`, data)
      } catch (e) {
        console.log(`apiRegister error`, e)
        return e
      }
    },
    // 註冊 => email 驗證
    async apiVerifyEmail(data: JsonObject) {
      return await axios.post(`${this.api}users/signup-with-email-verification`, data)
    },
    // 驗證 email 是否重複
    async apiCheckEmail(data: JsonObject) {
      try {
        return await axios.get(`${this.api}users/checkEmail/${data.email}`)
      } catch (e) {
        console.log(`apiCheckEmail error`, e)
        return e
      }
    },
    // 登入
    async apiLogin(data: JsonObject) {
      return await axios.post(`${this.api}users/sign_in`, data)
    },
    // google 登入 || 註冊
    async apiGoogleLogin() {
      return await axios.get(`${this.api}users/google`)
    },

    // todo 圖片 upload

    // 上傳單張圖片
    async apiUploadImage(data: JsonObject) {
      return await axios.post(`${this.api}upload/image`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },

    // todo 公告 announcements

    // 後台 取得公告列表
    async apiGetAdminAnnouncements(data: JsonObject) {
      const user = await this.getToken()
      console.log(`token = ${user}`)
      return await axios.get(
        `${this.api}announcements/admin?status=${data.status}&tag=${data.tag}&keyword=${data.keyword}&startDate=${data.startDate}&endDate=${data.endDate}`,
        {
          headers: {
            token: user
          }
        }
      )
    },

    // 後台 新增公告
    async apiPostAnnouncement(data: JsonObject) {
      const user = await this.getToken()
      console.log(`token = ${user}`)
      return await axios.post(`${this.api}announcements/`, data, {
        headers: {
          token: user
        }
      })
    },

    // 後台 編輯公告
    async apiUpdateAnnouncement(data: JsonObject) {
      const user = await this.getToken()
      console.log(`token = ${user}`)
      return await axios.put(`${this.api}announcements/update/${data.id}`, data, {
        headers: {
          token: user
        }
      })
    },

    // 後台 刪除公告
    async apiDeleteAnnouncement(data: JsonObject) {
      const user = await this.getToken()
      console.log(`token = ${user}`)
      return await axios.delete(`${this.api}announcements/delete/${data.id}`, {
        headers: {
          token: user
        }
      })
    },

    // 前台 取得公告列表
    async apiGetAnnouncements(data: JsonObject) {
      return await axios.get(
        `${this.api}announcements/all?sort=${data.sort}&tag=${data.tag}&keyword=${data.keyword}`
      )
    },

    // 前台 紀錄公告觀看次數
    async apiViewAnnouncement(data: JsonObject) {
      return await axios.put(`${this.api}announcements/views/${data.id}`)
    },

    // ========== 後台管理員登入 ==========

    // 後台 管理員登入
    async apiAdminLogin(data: JsonObject) {
      return await axios.post(`${this.api}users/adminLogin`, data)
    },

    // ========== 後台 圖鑑 ==========
    // 後台 新增圖鑑
    async apiAddPicData(data: JsonObject) {
      const user = await this.getToken()
      console.log(`token = ${user}`)
      return await axios.post(`${this.api}picData/`, data, {
        headers: {
          token: user
        }
      })
    },

    // 後台 編輯圖鑑
    async apiUpdatePicData(data: JsonObject) {
      const user = await this.getToken()
      console.log(`token = ${user}`)
      return await axios.put(`${this.api}picData/${data._id}`, data, {
        headers: {
          token: user
        }
      })
    },

    // 後台 刪除圖鑑
    async apiDeletePicData(data: JsonObject) {
      const user = await this.getToken()
      console.log(`token = ${user}`)
      return await axios.delete(`${this.api}picData/${data._id}`, {
        headers: {
          token: user
        }
      })
    },

    // 後台 取得圖鑑列表
    async apiGetPicDataList(data: JsonObject) {
      const user = await this.getToken()
      console.log(`token = ${user}`)
      return await axios.get(
        `${this.api}picData/?keyword=${data.keyword}&role=${data.role}&series=${data.series}&category=${data.category}&isShow=${data.isShow}&page=${data.page}&limit=${data.limit}`,
        {
          headers: {
            token: user
          }
        }
      )
    },

    // todo 本地端資料處理 localStorage

    // 使用者登入資料存 localStorage
    saveUserDataToLocalStorage(data: {
      token: string
      id: string
      name: string
      googleId: string
      avatar: string
      isAdmin?: boolean
    }) {
      // 將資料轉化為 JSON 字符串
      const userInfo = JSON.stringify(data)

      console.log(`userInfo = ${userInfo}`)

      // 存儲 userInfo 至 localStorage
      localStorage.setItem('userInfo', userInfo)
      // this.userInfo = userInfo;
      // this.isLoggedIn = userInfo !== null;
      // 更新 store 的狀態
      this.userInfo = JSON.parse(userInfo) // 將字符串解析回對象
      this.isLoggedIn = true // 設置登入狀態為 true
    },
    // 設置使用者 localStorage 資料
    setUserInfo(userInfo: any | null) {
      this.userInfo = userInfo
      this.isLoggedIn = userInfo !== null
    },
    // 取使用者 localStorage token
    getToken() {
      // 從 localStorage 中取得 userInfo 字符串
      const userInfoString = localStorage.getItem('userInfo')
      // 將字符串反序列化為 JavaScript 對象
      const userInfo = userInfoString ? JSON.parse(userInfoString) : null
      // 從 userInfo 對象中提取 token
      const token = userInfo ? userInfo.token : null
      return token
    },
    // 取使用者 localStorage 資料
    getUserInfoFromLocalStorage() {
      // 從 localStorage 取出 userInfo 字符串
      const userInfoString = localStorage.getItem('userInfo')
      // 將字符串反序列化為 JavaScript 對象
      const userInfo = userInfoString ? JSON.parse(userInfoString) : null
      return userInfo
    },
    // 登出方法，移除 localStorage 中的資訊
    logout() {
      // 直接移除名為 'userInfo' 的項目
      localStorage.removeItem('userInfo')
      this.userInfo = null
      this.isLoggedIn = false
    }
  },
  getters: {
    //   getUserInfo: (state) => state.userInfo,
  }
})
