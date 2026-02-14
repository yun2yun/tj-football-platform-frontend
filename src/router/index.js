import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getToken, getUserInfo } from '../utils/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录', noAuth: true }
  },
  {
    path: '/student',
    component: () => import('../views/student/StudentLayout.vue'),
    meta: { requiresAuth: true, role: 1 },
    redirect: '/student/home',
    children: [
      {
        path: 'home',
        name: 'StudentHome',
        component: () => import('../views/student/StudentAchievementList.vue'),
        meta: { title: '我的成果' }
      },
      {
        path: 'achievement/submit',
        name: 'StudentAchievementSubmit',
        component: () => import('../views/student/AchievementSubmit.vue'),
        meta: { title: '成果申报' }
      },
      {
        path: 'achievement/edit/:id',
        name: 'StudentAchievementEdit',
        component: () => import('../views/student/AchievementEdit.vue'),
        meta: { title: '编辑成果' }
      }
    ]
  },
  {
    path: '/teacher',
    component: () => import('../views/teacher/TeacherLayout.vue'),
    meta: { requiresAuth: true, role: 2 },
    redirect: '/teacher/pending',
    children: [
      {
        path: 'pending',
        name: 'TeacherPending',
        component: () => import('../views/teacher/TeacherPendingList.vue'),
        meta: { title: '待审核成果' }
      },
      {
        path: 'audited',
        name: 'TeacherAudited',
        component: () => import('../views/teacher/TeacherAuditedList.vue'),
        meta: { title: '已审核成果' }
      }
    ]
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  document.title = to.meta.title
    ? `${to.meta.title} - 同济足球创新成果记录平台`
    : '同济足球创新成果记录平台'

  if (to.meta.noAuth) {
    next()
    return
  }

  const token = getToken()
  const user = getUserInfo()

  if (!token || !user) {
    next('/login')
    return
  }

  // 角色权限控制（前端模拟）
  if (to.meta.requiresAuth && to.meta.role && to.meta.role !== user.role) {
    ElMessage.error('无权限访问')
    if (user.role === 1) {
      next('/student/home')
    } else if (user.role === 2) {
      next('/teacher/pending')
    } else {
      next('/login')
    }
    return
  }

  next()
})

export default router
