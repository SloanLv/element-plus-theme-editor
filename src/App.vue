<template>
  <div class="app-container">
    <!-- 顶部工具栏 -->
    <header class="app-header">
      <div class="header-left">
        <el-icon class="logo-icon"><Brush /></el-icon>
        <h1>Element Plus 主题编辑器</h1>
      </div>

      <div class="header-right">
        <el-tooltip content="撤销" placement="bottom">
          <el-button :icon="Back" :disabled="!canUndo()" circle @click="undo" />
        </el-tooltip>
        <el-tooltip content="重做" placement="bottom">
          <el-button :icon="Right" :disabled="!canRedo()" circle @click="redo" />
        </el-tooltip>

        <el-divider direction="vertical" />

        <el-tooltip content="重置为默认主题" placement="bottom">
          <el-button :icon="RefreshLeft" @click="onReset">重置</el-button>
        </el-tooltip>

        <el-tooltip content="从 JSON 文件导入主题" placement="bottom">
          <el-button :icon="Upload" @click="triggerImport">导入</el-button>
        </el-tooltip>

        <el-button type="primary" :icon="Download" @click="exportVisible = true">
          导出主题
        </el-button>
      </div>
    </header>

    <!-- 主体区域 -->
    <main class="app-main">
      <aside class="sidebar">
        <ThemePanel />
      </aside>
      <section class="preview-area">
        <PreviewPanel />
      </section>
    </main>

    <!-- 导出对话框 -->
    <ExportDialog v-model="exportVisible" />

    <!-- 隐藏的文件导入 input -->
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      style="display: none"
      @change="onFileImport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import {
  Brush,
  Back,
  Right,
  RefreshLeft,
  Upload,
  Download
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ThemePanel from './components/ThemePanel.vue'
import PreviewPanel from './components/PreviewPanel.vue'
// 异步加载导出对话框，仅在用户点击导出时才加载
const ExportDialog = defineAsyncComponent(() => import('./components/ExportDialog.vue'))
import { useTheme } from './composables/useTheme'

const { resetTheme, undo, redo, importTheme, canUndo, canRedo } = useTheme()

const exportVisible = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function onReset(): void {
  ElMessageBox.confirm('确定要重置为默认主题吗？当前修改将丢失。', '提示', {
    confirmButtonText: '确定重置',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      resetTheme()
      ElMessage.success('已重置为默认主题')
    })
    .catch(() => {})
}

function triggerImport(): void {
  fileInput.value?.click()
}

function onFileImport(e: Event): void {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target?.result as string)
      importTheme(data)
      ElMessage.success('主题导入成功')
    } catch {
      ElMessage.error('导入失败：文件格式不正确')
    }
  }
  reader.readAsText(file)
  // 清空 input 以便重复选择同一文件
  target.value = ''
}
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 60px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-lighter);
  flex-shrink: 0;
  box-shadow: var(--el-box-shadow-lighter);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 24px;
  color: var(--el-color-primary);
}

.header-left h1 {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  flex: 1;
  min-width: 0;
  border-right: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
  overflow: hidden;
}

.preview-area {
  width: 560px;
  flex-shrink: 0;
  border-left: 1px solid var(--el-border-color-lighter);
  overflow: hidden;
}
</style>
