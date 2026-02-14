import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, clearAuth } from '../utils/auth'

// 统一的 axios 实例，后续接入后端时只需调整 baseURL / 拦截逻辑
const service = axios.create({
  baseURL: '/api',
  timeout: 15000
})

service.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.token = token
    }
    return config
  },
  (error) => Promise.reject(error)
)

service.interceptors.response.use(
  (response) => {
    const res = response.data
    // 约定后的通用返回结构：{ code, msg, data }
    if (res && typeof res.code !== 'undefined') {
      if (res.code === 200) {
        return res.data
      }
      if (res.code === 401) {
        clearAuth()
        ElMessage.error('登录已过期，请重新登录')
        // 这里不直接跳转路由，避免在纯前端 mock 阶段出错
        return Promise.reject(new Error(res.msg || '未登录或登录已过期'))
      }
      if (res.code === 403) {
        ElMessage.error(res.msg || '暂无该功能操作权限')
        return Promise.reject(new Error(res.msg || '无权限'))
      }
      // 其它业务错误码
      ElMessage.error(res.msg || '请求失败，请稍后重试')
      return Promise.reject(new Error(res.msg || '请求失败'))
    }
    // 非约定结构时，直接返回原始数据，方便在 mock 阶段调试
    return response.data
  },
  (error) => {
    ElMessage.error('系统异常，请稍后重试')
    return Promise.reject(error)
  }
)

export default service

