<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ACHIEVEMENT_TYPE_OPTIONS,
  submitAchievement,
  initAchievementMockData
} from '../../services/achievementService'
import { getUserInfo } from '../../utils/auth'

// 初始化本地 mock 数据，确保第一次进入也有示例数据
initAchievementMockData()

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const form = reactive({
  achievementName: '',
  achievementType: undefined,
  achievementDesc: ''
})

const rules = {
  achievementName: [
    { required: true, message: '请输入成果名称', trigger: 'blur' },
    { min: 2, max: 50, message: '请输入 2-50 字的成果名称', trigger: 'blur' }
  ],
  achievementType: [{ required: true, message: '请选择成果类型', trigger: 'change' }],
  achievementDesc: [
    { required: true, message: '请输入成果描述', trigger: 'blur' },
    { min: 10, max: 500, message: '请输入 10-500 字的成果描述', trigger: 'blur' }
  ]
}

const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value
    .validate()
    .then(() => {
      const user = getUserInfo()
      if (!user) {
        ElMessage.error('登录状态已失效，请重新登录')
        router.replace('/login')
        return
      }
      loading.value = true
      submitAchievement({
        achievementName: form.achievementName,
        achievementType: form.achievementType,
        achievementDesc: form.achievementDesc,
        studentId: 1, // 前端模拟，固定为 1
        studentName: user.name || user.username
      })
      ElMessage.success('提交成功，等待教师审核')
      setTimeout(() => {
        router.push('/student/home')
      }, 3000)
    })
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
}

const onCancel = () => {
  router.push('/student/home')
}
</script>

<template>
  <div class="page-card">
    <h2 class="page-title">成果申报</h2>
    <p class="page-desc">填写足球创新成果信息并提交，等待教师审核。</p>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="form"
      @submit.prevent
    >
      <el-form-item label="成果名称" prop="achievementName">
        <el-input
          v-model="form.achievementName"
          placeholder="请输入成果名称"
          maxlength="50"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="成果类型" prop="achievementType">
        <el-select
          v-model="form.achievementType"
          placeholder="请选择成果类型"
          style="width: 100%"
          clearable
        >
          <el-option
            v-for="item in ACHIEVEMENT_TYPE_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="成果描述" prop="achievementDesc">
        <el-input
          v-model="form.achievementDesc"
          type="textarea"
          :rows="5"
          placeholder="请详细描述成果内容、创新点等"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="onSubmit">提交申报</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.page-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
.page-title {
  margin: 0 0 8px;
  font-size: 18px;
  color: #303133;
}
.page-desc {
  margin: 0 0 24px;
  font-size: 14px;
  color: #909399;
}
.form {
  max-width: 640px;
}
</style>
