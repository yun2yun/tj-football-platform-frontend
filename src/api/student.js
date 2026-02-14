import request from './request'

export function apiSubmitAchievement(data) {
  return request({
    url: '/student/achievement/submit',
    method: 'post',
    data
  })
}

export function apiQueryStudentAchievements(params) {
  return request({
    url: '/student/achievement/list',
    method: 'get',
    params
  })
}

export function apiGetAchievementDetail(params) {
  return request({
    url: '/student/achievement/detail',
    method: 'get',
    params
  })
}

export function apiEditAchievement(data) {
  return request({
    url: '/student/achievement/edit',
    method: 'put',
    data
  })
}

export function apiDeleteAchievement(data) {
  return request({
    url: '/student/achievement/delete',
    method: 'delete',
    data
  })
}

