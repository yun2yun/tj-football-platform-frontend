<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getUserInfo } from '../../utils/auth'
import {
  ACHIEVEMENT_TYPE_OPTIONS,
  AUDIT_STATUS_OPTIONS,
  queryStudentAchievements,
  deleteAchievement,
  getAchievementDetail
} from '../../services/achievementService'

const router = useRouter()
const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = ref({
  achievementType: '',
  auditStatus: '',
  page: 1,
  size: 10
})

const user = getUserInfo()
const studentId = user ? 1 : null // 前端模拟：固定为 1

const typeOptions = [{ value: '', label: '全部类型' }, ...ACHIEVEMENT_TYPE_OPTIONS]
const statusOptions = [{ value: '', label: '全部状态' }, ...AUDIT_STATUS_OPTIONS]

const loadList = () => {
  if (!studentId) return
  loading.value = true
  try {
    const res = queryStudentAchievements({
      studentId,
      ...query.value
    })
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

const canEditOrDelete = (row) => row.auditStatus === 0

const handleEdit = (row) => {
  router.push(`/student/achievement/edit/${row.achievementId}`)
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该成果？删除后将无法恢复。', '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteAchievement(row.achievementId)
      ElMessage.success('删除成功')
      loadList()
    })
    .catch(() => {})
}

const detailVisible = ref(false)
const detail = ref(null)

const showDetail = (row) => {
  detail.value = getAchievementDetail(row.achievementId)
  detailVisible.value = true
}

onMounted(loadList)
</script>

<template>
  <div class="page-card">
    <h2 class="page-title">我的成果</h2>
    <p class="page-desc">查看已提交的成果，支持编辑 / 删除待审核成果。</p>

    <div class="page-toolbar">
      <el-select
        v-model="query.achievementType"
        placeholder="成果类型"
        clearable
        style="width: 140px"
        @change="onQuery"
      >
        <el-option v-for="opt in typeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </el-select>
      <el-select
        v-model="query.auditStatus"
        placeholder="审核状态"
        clearable
        style="width: 140px"
        @change="onQuery"
      >
        <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </el-select>
      <el-button type="primary" @click="onQuery">查询</el-button>
    </div>

    <el-table v-loading="loading" :data="list" stripe style="width: 100%">
      <el-table-column prop="achievementName" label="成果名称" min-width="200" show-overflow-tooltip />
      <el-table-column prop="achievementTypeName" label="类型" width="120" />
      <el-table-column prop="auditStatusName" label="审核状态" width="110">
        <template #default="{ row }">
          <el-tag v-if="row.auditStatus === 0" type="warning">待审核</el-tag>
          <el-tag v-else-if="row.auditStatus === 1" type="success">通过</el-tag>
          <el-tag v-else type="danger">驳回</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="submitTime" label="提交时间" width="180" />
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="showDetail(row)">查看</el-button>
          <el-button
            v-if="canEditOrDelete(row)"
            type="primary"
            link
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="canEditOrDelete(row)"
            type="danger"
            link
            @click="handleDelete(row)"
          >
            删除
          </el-button>
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

    <el-drawer v-model="detailVisible" title="成果详情" size="480" direction="rtl">
      <template v-if="detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="成果名称">
            {{ detail.achievementName }}
          </el-descriptions-item>
          <el-descriptions-item label="成果类型">
            {{ detail.achievementTypeName }}
          </el-descriptions-item>
          <el-descriptions-item label="成果描述">
            <div class="desc-text">
              {{ detail.achievementDesc }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="审核状态">
            <el-tag v-if="detail.auditStatus === 0" type="warning">待审核</el-tag>
            <el-tag v-else-if="detail.auditStatus === 1" type="success">通过</el-tag>
            <el-tag v-else type="danger">驳回</el-tag>
          </el-descriptions-item>
          <el-descriptions-item v-if="detail.auditOpinion" label="审核意见">
            {{ detail.auditOpinion }}
          </el-descriptions-item>
          <el-descriptions-item label="提交时间">
            {{ detail.submitTime }}
          </el-descriptions-item>
          <el-descriptions-item v-if="detail.auditTime" label="审核时间">
            {{ detail.auditTime }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <template v-else>
        <el-empty description="暂无数据" />
      </template>
    </el-drawer>
  </div>
</template>

<style scoped>
.desc-text {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>

