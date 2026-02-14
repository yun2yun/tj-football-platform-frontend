import request from './request'

// 说明：目前项目仍处于纯前端 mock 阶段，暂不真正调用该接口。
// 后端完成后，只需要在业务代码中改为使用这些方法即可。

export function apiLogin(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function apiLogout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function apiGetCurrentUser() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

