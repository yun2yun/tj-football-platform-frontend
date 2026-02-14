<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ACHIEVEMENT_TYPE_OPTIONS,
  getAchievementDetail,
  updateAchievement
} from '../../services/achievementService'

const route = useRoute()
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

const loadDetail = () => {
  const id = route.params.id
  const detail = getAchievementDetail(id)
  if (!detail) {
    ElMessage.error('成果不存在或已被删除')
    router.replace('/student/home')
    return
  }
  if (detail.auditStatus !== 0) {
    ElMessage.warning('仅待审核成果可编辑')
    router.replace('/student/home')
    return
  }
  form.achievementName = detail.achievementName
  form.achievementType = detail.achievementType
  form.achievementDesc = detail.achievementDesc
}

const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value
    .validate()
    .then(() => {
      const id = route.params.id
      loading.value = true
      const ok = updateAchievement(id, {
        achievementName: form.achievementName,
        achievementType: form.achievementType,
        achievementDesc: form.achievementDesc
      })
      if (ok) {
        ElMessage.success('保存成功')
        router.push('/student/home')
      } else {
        ElMessage.error('保存失败，请稍后重试')
      }
    })
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
}

const onCancel = () => {
  router.push('/student/home')
}

onMounted(loadDetail)
</script>

<template>
  <div class="page-card">
    <h2 class="page-title">编辑成果</h2>
    <p class="page-desc">仅可编辑待审核的成果。</p>
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
        <el-button type="primary" :loading="loading" @click="onSubmit">保存</el-button>
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

