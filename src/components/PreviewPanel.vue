<template>
  <div class="preview-panel">
    <div class="preview-header">
      <h3>实时预览</h3>
      <el-radio-group v-model="previewBg" size="small">
        <el-radio-button label="light">浅色背景</el-radio-button>
        <el-radio-button label="dark">深色背景</el-radio-button>
      </el-radio-group>
    </div>

    <div class="preview-body" :class="{ 'dark-bg': previewBg === 'dark' }">
      <!-- 按钮 -->
      <section class="preview-section">
        <div class="section-title">按钮 Button</div>
        <div class="section-content">
          <el-button>默认</el-button>
          <el-button type="primary">主要</el-button>
          <el-button type="success">成功</el-button>
          <el-button type="warning">警告</el-button>
          <el-button type="danger">危险</el-button>
          <el-button type="info">信息</el-button>
        </div>
        <div class="section-content">
          <el-button plain>朴素</el-button>
          <el-button type="primary" plain>主要</el-button>
          <el-button type="success" plain>成功</el-button>
          <el-button round>圆角</el-button>
          <el-button type="primary" round>主要</el-button>
          <el-button disabled>禁用</el-button>
        </div>
        <div class="section-content">
          <el-button size="large">大</el-button>
          <el-button size="default">默认</el-button>
          <el-button size="small">小</el-button>
          <el-button type="primary" :icon="Search">搜索</el-button>
          <el-button type="primary" :icon="Edit" circle />
          <el-button type="danger" :icon="Delete" circle />
        </div>
      </section>

      <!-- 标签 -->
      <section class="preview-section">
        <div class="section-title">标签 Tag</div>
        <div class="section-content">
          <el-tag>默认</el-tag>
          <el-tag type="primary">主要</el-tag>
          <el-tag type="success">成功</el-tag>
          <el-tag type="warning">警告</el-tag>
          <el-tag type="danger">危险</el-tag>
          <el-tag type="info">信息</el-tag>
          <el-tag effect="dark">深色</el-tag>
          <el-tag effect="plain">朴素</el-tag>
          <el-tag closable>可关闭</el-tag>
        </div>
      </section>

      <!-- 输入框 -->
      <section class="preview-section">
        <div class="section-title">输入框 Input</div>
        <div class="section-content input-group">
          <el-input v-model="inputVal" placeholder="请输入内容" style="width: 220px" />
          <el-input v-model="inputVal" placeholder="禁用状态" disabled style="width: 220px" />
          <el-input-number v-model="numVal" :min="1" :max="10" />
        </div>
      </section>

      <!-- 开关与选择器 -->
      <section class="preview-section">
        <div class="section-title">开关 / 选择器 / 单选</div>
        <div class="section-content">
          <el-switch v-model="switchVal" />
          <el-switch v-model="switchVal" active-text="开" inactive-text="关" />
          <el-select v-model="selectVal" placeholder="请选择" style="width: 160px">
            <el-option label="选项一" value="1" />
            <el-option label="选项二" value="2" />
          </el-select>
          <el-radio-group v-model="radioVal">
            <el-radio label="1">选项一</el-radio>
            <el-radio label="2">选项二</el-radio>
          </el-radio-group>
          <el-checkbox-group v-model="checkVal">
            <el-checkbox label="A">A</el-checkbox>
            <el-checkbox label="B">B</el-checkbox>
          </el-checkbox-group>
        </div>
      </section>

      <!-- 进度条与滑块 -->
      <section class="preview-section">
        <div class="section-title">进度条 / 滑块</div>
        <div class="section-content vertical-stack">
          <el-progress :percentage="70" />
          <el-progress :percentage="50" status="success" />
          <el-progress :percentage="90" status="warning" />
          <el-progress :percentage="30" status="exception" />
          <el-slider v-model="sliderVal" style="max-width: 400px" />
        </div>
      </section>

      <!-- 提示 -->
      <section class="preview-section">
        <div class="section-title">提示 Alert</div>
        <div class="section-content vertical-stack">
          <el-alert title="成功提示的文案" type="success" show-icon />
          <el-alert title="消息提示的文案" type="info" show-icon />
          <el-alert title="警告提示的文案" type="warning" show-icon />
          <el-alert title="错误提示的文案" type="error" show-icon />
        </div>
      </section>

      <!-- 卡片 -->
      <section class="preview-section">
        <div class="section-title">卡片 Card</div>
        <div class="section-content">
          <el-card style="max-width: 360px">
            <template #header>
              <div class="card-header">
                <span>卡片名称</span>
                <el-button text type="primary">操作按钮</el-button>
              </div>
            </template>
            <p>这是卡片内容，展示边框、圆角、阴影等样式效果。</p>
          </el-card>
        </div>
      </section>

      <!-- 表格 -->
      <section class="preview-section">
        <div class="section-title">表格 Table</div>
        <div class="section-content">
          <el-table :data="tableData" style="max-width: 600px" border>
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="age" label="年龄" width="100" />
            <el-table-column prop="city" label="城市" />
            <el-table-column label="操作" width="120">
              <template #default>
                <el-button size="small" type="primary" link>编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>

      <!-- 分页 -->
      <section class="preview-section">
        <div class="section-title">分页 Pagination</div>
        <div class="section-content">
          <el-pagination
            layout="prev, pager, next"
            :total="50"
            :default-page-size="10"
          />
        </div>
      </section>

      <!-- 日期 -->
      <section class="preview-section">
        <div class="section-title">日期选择器</div>
        <div class="section-content">
          <el-date-picker
            v-model="dateVal"
            type="date"
            placeholder="选择日期"
            style="width: 200px"
          />
        </div>
      </section>

      <!-- 头像与徽标 -->
      <section class="preview-section">
        <div class="section-title">头像 / 徽标</div>
        <div class="section-content">
          <el-avatar :size="40" :icon="UserFilled" />
          <el-badge :value="12" class="badge-item">
            <el-button :icon="Bell" circle />
          </el-badge>
          <el-badge value="hot" class="badge-item">
            <el-button>评论</el-button>
          </el-badge>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Search,
  Edit,
  Delete,
  Bell,
  UserFilled
} from '@element-plus/icons-vue'
import { useDarkMode } from '../composables/useDarkMode'

const { isDark } = useDarkMode()

// 预览背景跟随编辑器深色/浅色模式
const previewBg = ref<string>(isDark.value ? 'dark' : 'light')
watch(isDark, (dark) => {
  previewBg.value = dark ? 'dark' : 'light'
})

const inputVal = ref<string>('')
const numVal = ref<number>(1)
const switchVal = ref<boolean>(true)
const selectVal = ref<string>('')
const radioVal = ref<string>('1')
const checkVal = ref<string[]>(['A'])
const sliderVal = ref<number>(40)
const dateVal = ref<string>('')

interface TableRow {
  name: string
  age: number
  city: string
}

const tableData: TableRow[] = [
  { name: '张三', age: 28, city: '北京' },
  { name: '李四', age: 32, city: '上海' },
  { name: '王五', age: 25, city: '广州' }
]
</script>

<style scoped>
.preview-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.preview-header h3 {
  font-size: 16px;
  color: var(--el-text-color-primary);
}

.preview-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  transition: background 0.3s;
}

.preview-body.dark-bg {
  background: var(--el-bg-color-page);
}

.preview-section {
  margin-bottom: 28px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid var(--el-color-primary);
}

.section-content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

.section-content:last-child {
  margin-bottom: 0;
}

.vertical-stack {
  flex-direction: column;
  align-items: stretch;
  max-width: 500px;
  gap: 12px;
}

.input-group {
  gap: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge-item {
  margin-right: 30px;
}
</style>
