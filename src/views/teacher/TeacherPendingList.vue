<script setup>
import { ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  ACHIEVEMENT_TYPE_OPTIONS,
  queryTeacherPending,
  auditAchievement
} from '../../services/achievementService'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = ref({
  achievementType: '',
  page: 1,
  size: 10
})

const typeOptions = [{ value: '', label: '全部类型' }, ...ACHIEVEMENT_TYPE_OPTIONS]

const loadList = () => {
  loading.value = true
  try {
    const res = queryTeacherPending(query.value)
    list.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

const onQuery = () => {
  query.value.page = 1
  loadList()
}

const onPageChange = (page) => {
  query.value.page = page
  loadList()
}

const onPageSizeChange = (size) => {
  query.value.size = size
  query.value.page = 1
  loadList()
}

const handleApprove = (row) => {
  const ok = auditAchievement({
    achievementId: row.achievementId,
    auditStatus: 1,
    auditOpinion: ''
  })
  if (ok) {
    ElMessage.success('审核通过')
    loadList()
  } else {
    ElMessage.error('操作失败，请稍后重试')
  }
}

const handleReject = (row) => {
  let inputValue = ''
  ElMessageBox.prompt('请输入审核驳回意见（至少 5 个字）', '审核驳回', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValidator: (val) => {
      if (!val || val.trim().length < 5) {
        return '驳回时请填写至少 5 字的审核意见'
      }
      inputValue = val.trim()
      return true
    }
  })
    .then(() => {
      const ok = auditAchievement({
        achievementId: row.achievementId,
        auditStatus: 2,
        auditOpinion: inputValue
      })
      if (ok) {
        ElMessage.success('审核驳回成功')
        loadList()
      } else {
        ElMessage.error('操作失败，请稍后重试')
      }
    })
    .catch(() => {})
}

onMounted(loadList)
</script>

<template>
  <div class="page-card">
    <h2 class="page-title">待审核成果</h2>
    <p class="page-desc">查看并审核分配给当前教师的待审核成果（前端模拟）。</p>

    <div class="page-toolbar">
      <el-select
        v-model="query.achievementType"
        placeholder="成果类型"
        clearable
        style="width: 160px"
        @change="onQuery"
      >
        <el-option v-for="opt in typeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </el-select>
      <el-button type="primary" @click="onQuery">查询</el-button>
    </div>

    <el-table v-loading="loading" :data="list" stripe style="width: 100%">
      <el-table-column prop="studentName" label="学生姓名" width="120" />
      <el-table-column prop="achievementName" label="成果名称" min-width="220" show-overflow-tooltip />
      <el-table-column prop="achievementTypeName" label="类型" width="120" />
      <el-table-column prop="submitTime" label="提交时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="success" link @click="handleApprove(row)">通过</el-button>
          <el-button type="danger" link @click="handleReject(row)">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page-pagination">
      <el-pagination
        v-model:current-page="query.page"
        v-model:page-size="query.size"
        :page-sizes="[10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        @current-change="onPageChange"
        @size-change="onPageSizeChange"
      />
    </div>
  </div>
</template>

<style scoped>
</style>

