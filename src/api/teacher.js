import request from './request'

export function apiQueryTeacherPending(params) {
  return request({
    url: '/teacher/achievement/pending/list',
    method: 'get',
    params
  })
}

export function apiAuditAchievement(data) {
  return request({
    url: '/teacher/achievement/audit',
    method: 'post',
    data
  })
}

export function apiQueryTeacherAudited(params) {
  return request({
    url: '/teacher/achievement/audited/list',
    method: 'get',
    params
  })
}

