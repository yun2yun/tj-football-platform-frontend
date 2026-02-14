// 统一的成果业务服务层
// 当前处于纯前端 mock 阶段，这里默认走本地 mock 数据。
// 后续接入后端时，只需要把内部实现切换为调用 src/api 下的接口即可，
// 页面组件无需修改。

import {
  ACHIEVEMENT_TYPES,
  AUDIT_STATUS,
  queryStudentAchievements as mockQueryStudentAchievements,
  getAchievementDetail as mockGetAchievementDetail,
  submitAchievement as mockSubmitAchievement,
  updateAchievement as mockUpdateAchievement,
  deleteAchievement as mockDeleteAchievement,
  queryTeacherPending as mockQueryTeacherPending,
  queryTeacherAudited as mockQueryTeacherAudited,
  auditAchievement as mockAuditAchievement,
  initMockDataIfEmpty as mockInitMockDataIfEmpty
} from '../mock/achievement'

// 如果未来需要切换到真实接口，可以把这个开关改为读取环境变量
const useMock = true

export const ACHIEVEMENT_TYPE_OPTIONS = ACHIEVEMENT_TYPES
export const AUDIT_STATUS_OPTIONS = AUDIT_STATUS

export function initAchievementMockData() {
  if (useMock) {
    mockInitMockDataIfEmpty()
  }
}

// 学生端
export function queryStudentAchievements(params) {
  if (useMock) {
    return mockQueryStudentAchievements(params)
  }
  // TODO: 换成真实接口：apiQueryStudentAchievements(params)
  return { total: 0, list: [] }
}

export function getAchievementDetail(achievementId) {
  if (useMock) {
    return mockGetAchievementDetail(achievementId)
  }
  // TODO: 真实接口：apiGetAchievementDetail({ achievementId })
  return null
}

export function submitAchievement(data) {
  if (useMock) {
    return mockSubmitAchievement(data)
  }
  // TODO: 真实接口：apiSubmitAchievement(data)
  return { achievementId: null }
}

export function updateAchievement(achievementId, payload) {
  if (useMock) {
    return mockUpdateAchievement(achievementId, payload)
  }
  // TODO: 真实接口：apiEditAchievement({ achievementId, ...payload })
  return false
}

export function deleteAchievement(achievementId) {
  if (useMock) {
    return mockDeleteAchievement(achievementId)
  }
  // TODO: 真实接口：apiDeleteAchievement({ achievementId })
}

// 教师端
export function queryTeacherPending(params) {
  if (useMock) {
    return mockQueryTeacherPending(params)
  }
  // TODO: 真实接口：apiQueryTeacherPending(params)
  return { total: 0, list: [] }
}

export function queryTeacherAudited(params) {
  if (useMock) {
    return mockQueryTeacherAudited(params)
  }
  // TODO: 真实接口：apiQueryTeacherAudited(params)
  return { total: 0, list: [] }
}

export function auditAchievement(payload) {
  if (useMock) {
    return mockAuditAchievement(payload)
  }
  // TODO: 真实接口：apiAuditAchievement(payload)
  return false
}

