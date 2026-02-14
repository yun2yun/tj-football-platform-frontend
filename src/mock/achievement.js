// 成果类型：1=战术 2=训练 3=赛事 4=科研 5=其他
export const ACHIEVEMENT_TYPES = [
  { value: 1, label: '足球战术' },
  { value: 2, label: '足球训练' },
  { value: 3, label: '足球赛事' },
  { value: 4, label: '足球科研' },
  { value: 5, label: '其他足球相关' }
]

// 审核状态：0=待审核 1=通过 2=驳回
export const AUDIT_STATUS = [
  { value: 0, label: '待审核' },
  { value: 1, label: '审核通过' },
  { value: 2, label: '审核驳回' }
]

const STORAGE_KEY = 'tj_football_achievements'

function getList() {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    return s ? JSON.parse(s) : []
  } catch {
    return []
  }
}

function saveList(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

let nextId = 1000
function genId() {
  const list = getList()
  const max = list.reduce((m, i) => Math.max(m, i.achievementId || 0), 0)
  nextId = Math.max(nextId, max) + 1
  return nextId
}

// 学生端：查询自己的成果列表
export function queryStudentAchievements(params = {}) {
  const { studentId, achievementType, auditStatus, page = 1, size = 10 } = params
  let list = getList()
  if (studentId != null) {
    list = list.filter((i) => i.studentId === Number(studentId))
  }
  if (achievementType != null && achievementType !== '') {
    list = list.filter((i) => i.achievementType === Number(achievementType))
  }
  if (auditStatus != null && auditStatus !== '') {
    list = list.filter((i) => i.auditStatus === Number(auditStatus))
  }
  const total = list.length
  const start = (page - 1) * size
  const pageList = list.slice(start, start + size)
  return { total, list: pageList }
}

export function getAchievementDetail(achievementId) {
  const list = getList()
  return list.find((i) => i.achievementId === Number(achievementId)) || null
}

export function submitAchievement(data) {
  const list = getList()
  const id = genId()
  const typeItem = ACHIEVEMENT_TYPES.find((t) => t.value === data.achievementType)
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
  const newItem = {
    achievementId: id,
    achievementName: data.achievementName,
    achievementType: data.achievementType,
    achievementTypeName: typeItem ? typeItem.label : '其他',
    achievementDesc: data.achievementDesc,
    submitTime: now,
    auditStatus: 0,
    auditStatusName: '待审核',
    auditOpinion: '',
    studentId: data.studentId,
    studentName: data.studentName
  }
  list.unshift(newItem)
  saveList(list)
  return { achievementId: id }
}

export function updateAchievement(achievementId, payload) {
  const list = getList()
  const idx = list.findIndex((i) => i.achievementId === Number(achievementId))
  if (idx === -1) return false
  list[idx] = { ...list[idx], ...payload }
  saveList(list)
  return true
}

export function deleteAchievement(achievementId) {
  const list = getList()
  const newList = list.filter((i) => i.achievementId !== Number(achievementId))
  saveList(newList)
}

// 教师端：待审核列表
export function queryTeacherPending(params = {}) {
  const { achievementType, page = 1, size = 10 } = params
  let list = getList().filter((i) => i.auditStatus === 0)
  if (achievementType != null && achievementType !== '') {
    list = list.filter((i) => i.achievementType === Number(achievementType))
  }
  const total = list.length
  const start = (page - 1) * size
  const pageList = list.slice(start, start + size)
  return { total, list: pageList }
}

// 教师端：已审核列表
export function queryTeacherAudited(params = {}) {
  const { achievementType, auditStatus, page = 1, size = 10 } = params
  let list = getList().filter((i) => i.auditStatus !== 0)
  if (achievementType != null && achievementType !== '') {
    list = list.filter((i) => i.achievementType === Number(achievementType))
  }
  if (auditStatus != null && auditStatus !== '') {
    list = list.filter((i) => i.auditStatus === Number(auditStatus))
  }
  const total = list.length
  const start = (page - 1) * size
  const pageList = list.slice(start, start + size)
  return { total, list: pageList }
}

// 教师审核操作
export function auditAchievement({ achievementId, auditStatus, auditOpinion }) {
  const list = getList()
  const idx = list.findIndex((i) => i.achievementId === Number(achievementId))
  if (idx === -1) return false
  const statusItem = AUDIT_STATUS.find((s) => s.value === auditStatus)
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
  list[idx] = {
    ...list[idx],
    auditStatus,
    auditStatusName: statusItem ? statusItem.label : '',
    auditOpinion: auditStatus === 2 ? auditOpinion : '',
    auditTime: now
  }
  saveList(list)
  return true
}

export function initMockDataIfEmpty() {
  const list = getList()
  if (list.length > 0) return
  const mockList = [
    {
      achievementId: 1001,
      achievementName: '青少年足球趣味训练方案',
      achievementType: 2,
      achievementTypeName: '足球训练',
      achievementDesc:
        '基于8-12岁青少年的足球趣味训练方法设计，包含3类基础动作训练、2类对抗训练。',
      submitTime: '2025-11-01 10:00:00',
      auditStatus: 0,
      auditStatusName: '待审核',
      auditOpinion: '',
      studentId: 1,
      studentName: '张三'
    },
    {
      achievementId: 1002,
      achievementName: '校园足球赛事策划',
      achievementType: 3,
      achievementTypeName: '足球赛事',
      achievementDesc:
        '策划面向校内1-3年级的足球趣味赛，包含赛程安排、裁判规则、奖励设置等内容。',
      submitTime: '2025-11-02 14:30:00',
      auditStatus: 1,
      auditStatusName: '审核通过',
      auditOpinion: '',
      studentId: 1,
      studentName: '张三'
    }
  ]
  saveList(mockList)
}
