<template>
  <el-dialog v-model="visible" title="导出主题" width="720px" top="6vh">
    <div class="export-dialog">
      <!-- 格式选择 -->
      <el-radio-group v-model="format" class="format-group">
        <el-radio-button label="css">
          <el-icon><Document /></el-icon> CSS 变量
        </el-radio-button>
        <el-radio-button label="scss">
          <el-icon><Files /></el-icon> SCSS 变量
        </el-radio-button>
        <el-radio-button label="json">
          <el-icon><Coin /></el-icon> JSON 配置
        </el-radio-button>
      </el-radio-group>

      <!-- 使用说明 -->
      <el-alert
        :title="usageTip"
        type="info"
        :closable="false"
        show-icon
        class="usage-tip"
      />

      <!-- 代码预览 -->
      <div class="code-preview">
        <div class="code-header">
          <span class="filename">{{ filename }}</span>
          <el-button text size="small" :icon="CopyDocument" @click="copyCode">
            复制
          </el-button>
        </div>
        <pre class="code-block"><code>{{ codePreview }}</code></pre>
      </div>
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :icon="Download" @click="doExport">
        下载文件
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Document,
  Files,
  Coin,
  CopyDocument,
  Download
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useTheme } from '../composables/useTheme'
import { exportCSS, exportSCSS, exportJSON, exportTheme } from '../utils/export'
import type { ExportFormat } from '../utils/export'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

const { themeVars } = useTheme()

const visible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})

const format = ref<ExportFormat>('css')

const filename = computed(() => {
  const map: Record<ExportFormat, string> = {
    css: 'element-plus-theme.css',
    scss: 'element-plus-theme.scss',
    json: 'element-plus-theme.json'
  }
  return map[format.value]
})

const codePreview = computed(() => {
  switch (format.value) {
    case 'css': return exportCSS(themeVars)
    case 'scss': return exportSCSS(themeVars)
    case 'json': return exportJSON(themeVars)
    default: return ''
  }
})

const usageTip = computed(() => {
  switch (format.value) {
    case 'css':
      return 'CSS 格式：将文件引入项目，或在 :root 中直接使用这些 CSS 变量即可覆盖 Element Plus 默认主题。'
    case 'scss':
      return 'SCSS 格式：通过 @use 引入此文件，可在编译时覆盖 Element Plus 的 SCSS 变量。'
    case 'json':
      return 'JSON 格式：可用于备份主题配置，或通过编辑器重新导入恢复主题。'
    default:
      return ''
  }
})

function copyCode(): void {
  navigator.clipboard.writeText(codePreview.value).then(() => {
    ElMessage.success('已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

function doExport(): void {
  exportTheme(format.value, themeVars)
  ElMessage.success('主题文件已下载')
  visible.value = false
}
</script>

<style scoped>
.export-dialog {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.format-group {
  display: flex;
  justify-content: center;
}

.usage-tip {
  margin: 0;
}

.code-preview {
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  overflow: hidden;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.filename {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  font-family: monospace;
}

.code-block {
  margin: 0;
  padding: 16px;
  max-height: 320px;
  overflow: auto;
  background: #1e1e1e;
}

.code-block code {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: #d4d4d4;
  line-height: 1.6;
  white-space: pre;
}
</style>
