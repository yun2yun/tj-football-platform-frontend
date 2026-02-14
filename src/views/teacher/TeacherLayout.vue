<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { getUserInfo, clearAuth } from '../../utils/auth'

const router = useRouter()
const route = useRoute()
const user = computed(() => getUserInfo() || {})

const activeMenu = computed(() => route.path)

const menuList = [
  { path: '/teacher/pending', title: '待审核成果' },
  { path: '/teacher/audited', title: '已审核成果' }
]

const onLogout = () => {
  ElMessageBox.confirm('确定退出登录？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      clearAuth()
      router.replace('/login')
    })
    .catch(() => {})
}
</script>

<template>
  <div class="layout">
    <aside class="sider">
      <div class="logo">同济足球创新成果记录平台 · 教师端</div>
      <el-menu :default-active="activeMenu" class="menu" router>
        <el-menu-item v-for="m in menuList" :key="m.path" :index="m.path">
          {{ m.title }}
        </el-menu-item>
        <el-menu-item index="/logout" @click="onLogout">
          退出登录
        </el-menu-item>
      </el-menu>
      <div class="user-info">
        当前用户：{{ user.name || user.username }}（教师）
      </div>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  background: #f5f7fa;
}
.sider {
  width: 220px;
  background: #ffffff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
}
.logo {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
  border-bottom: 1px solid #e8e8e8;
}
.menu {
  border-right: none;
  flex: 1;
}
.user-info {
  padding: 12px 16px;
  font-size: 13px;
  color: #666;
  border-top: 1px solid #e8e8e8;
}
.content {
  flex: 1;
  padding: 20px;
  overflow: auto;
}
</style>

