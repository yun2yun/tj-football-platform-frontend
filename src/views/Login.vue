<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { setToken, setUserInfo, getToken, getUserInfo } from '../utils/auth'

const router = useRouter()
const form = ref({
  username: '',
  password: '',
  role: null
})
const loading = ref(false)

const roleOptions = [
  { value: 1, label: '学生' },
  { value: 2, label: '教师' }
]

const goHomeByRole = (role) => {
  if (role === 1) {
    router.push('/student/home')
  } else if (role === 2) {
    router.push('/teacher/pending')
  } else {
    router.push('/login')
  }
}

const onSubmit = async () => {
  if (!form.value.username.trim()) {
    ElMessage.warning('请输入账号')
    return
  }
  if (!form.value.password) {
    ElMessage.warning('请输入密码')
    return
  }
  if (!form.value.role) {
    ElMessage.warning('请选择登录角色')
    return
  }
  loading.value = true
  try {
    // 模拟登录：仅校验非空，不校验账号密码真实性
    const token = 'mock_token_' + Date.now()
    const role = form.value.role
    const roleNames = { 1: '学生', 2: '教师' }
    const defaultNames = { 1: '张三', 2: '李老师' }
    const userInfo = {
      username: form.value.username,
      password: form.value.password,
      name: defaultNames[role],
      role,
      roleName: roleNames[role]
    }
    setToken(token)
    setUserInfo(userInfo)
    ElMessage.success('登录成功')
    goHomeByRole(role)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (getToken()) {
    const user = getUserInfo()
    if (user?.role) {
      goHomeByRole(user.role)
    }
  } else {
    // 默认填充示例账号，方便演示
    form.value.username = '2023001'
    form.value.password = '123456'
    form.value.role = 1
  }
})
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="title">同济国际足球学院</h1>
      <p class="subtitle">创新创业成果记录平台</p>
      <el-form :model="form" label-width="0" class="form" @submit.prevent="onSubmit">
        <el-form-item>
          <el-input v-model="form.username" placeholder="账号（如 2023001 / teacher01）" size="large" clearable />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码（示例：123456）"
            size="large"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.role"
            placeholder="选择角色"
            size="large"
            style="width: 100%"
          >
            <el-option
              v-for="opt in roleOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" style="width: 100%" :loading="loading" @click="onSubmit">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <p class="tip">
        示例账号：学生 2023001 / 教师 teacher01，密码均为 123456（仅前端模拟）
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%);
}
.login-card {
  width: 380px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
.title {
  margin: 0 0 8px;
  font-size: 22px;
  color: #1a472a;
  text-align: center;
}
.subtitle {
  margin: 0 0 28px;
  font-size: 14px;
  color: #666;
  text-align: center;
}
.form {
  margin-bottom: 12px;
}
.tip {
  margin: 0;
  font-size: 12px;
  color: #999;
  text-align: center;
}
</style>
