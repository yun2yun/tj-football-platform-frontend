<script setup>
import { ref, onMounted } from 'vue'
import {
  ACHIEVEMENT_TYPE_OPTIONS,
  AUDIT_STATUS_OPTIONS,
  queryTeacherAudited
} from '../../services/achievementService'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = ref({
  achievementType: '',
  auditStatus: '',
  page: 1,
  size: 10
})

const typeOptions = [{ value: '', label: '全部类型' }, ...ACHIEVEMENT_TYPE_OPTIONS]
const statusOptions = [
  { value: '', label: '全部状态' },
  ...AUDIT_STATUS_OPTIONS.filter((s) => s.value !== 0)
]

const loadList = () => {
  loading.value = true
  try {
    const res = queryTeacherAudited(query.value)
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

onMounted(loadList)
</script>

<template>
  <div class="page-card">
    <h2 class="page-title">已审核成果</h2>
    <p class="page-desc">查看当前教师已审核的成果（前端静态模拟，无真实分配逻辑）。</p>

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
      <el-select
        v-model="query.auditStatus"
        placeholder="审核结果"
        clearable
        style="width: 160px"
        @change="onQuery"
      >
        <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </el-select>
      <el-button type="primary" @click="onQuery">查询</el-button>
    </div>

    <el-table v-loading="loading" :data="list" stripe style="width: 100%">
      <el-table-column prop="studentName" label="学生姓名" width="120" />
      <el-table-column prop="achievementName" label="成果名称" min-width="220" show-overflow-tooltip />
      <el-table-column prop="achievementTypeName" label="类型" width="120" />
      <el-table-column prop="auditStatusName" label="审核状态" width="110">
        <template #default="{ row }">
          <el-tag v-if="row.auditStatus === 1" type="success">通过</el-tag>
          <el-tag v-else type="danger">驳回</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="submitTime" label="提交时间" width="180" />
      <el-table-column prop="auditTime" label="审核时间" width="180" />
      <el-table-column prop="auditOpinion" label="审核意见（仅驳回）" min-width="220">
        <template #default="{ row }">
          <span v-if="row.auditStatus === 2">{{ row.auditOpinion || '-' }}</span>
          <span v-else>-</span>
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

