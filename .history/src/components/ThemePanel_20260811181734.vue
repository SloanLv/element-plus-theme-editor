<template>
  <div class="theme-panel">
    <!-- 分组标签页 -->
    <el-tabs v-model="activeGroup" tab-position="left" class="group-tabs">
      <el-tab-pane v-for="group in themeGroups" :key="group.id" :name="group.id">
        <template #label>
          <div class="tab-label">
            <el-icon><component :is="group.icon" /></el-icon>
            <span>{{ group.title }}</span>
          </div>
        </template>

        <div class="group-content">
          <div class="group-header">
            <h3>{{ group.title }}</h3>
            <p class="group-desc">{{ group.desc }}</p>
          </div>

          <!-- 主题色组：特殊处理，编辑基础色自动生成变体 -->
          <template v-if="group.id === 'colors'">
            <div v-for="c in primaryColors" :key="c.key" class="var-row color-row">
              <div class="var-info">
                <span class="var-label">{{ c.label }}</span>
                <el-tag size="small" type="info">{{ themeVars[`--el-color-${c.key}`] }}</el-tag>
              </div>
              <el-color-picker
                :model-value="themeVars[`--el-color-${c.key}`]"
                show-alpha
                @change="(val: string | null) => onPrimaryColorChange(c.key, val)"
              />
            </div>
            <!-- 变体预览 -->
            <el-divider content-position="left">自动生成的颜色变体</el-divider>
            <div class="variant-preview">
              <div
                v-for="c in primaryColors"
                :key="c.key"
                class="variant-group"
              >
                <div class="variant-title">{{ c.label }}</div>
                <div class="variant-swatches">
                  <div
                    v-for="v in getVariants(c.key)"
                    :key="v.key"
                    class="swatch"
                    :style="{ background: v.value }"
                  >
                    <span class="swatch-label">{{ v.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- 颜色类分组 -->
          <template
            v-else-if="['text', 'border', 'fill', 'bg'].includes(group.id)"
          >
            <div
              v-for="v in getColorGroupVars(group.id)"
              :key="v.key"
              class="var-row color-row"
            >
              <div class="var-info">
                <span class="var-label">{{ v.label }}</span>
                <el-tag size="small" type="info">{{ themeVars[v.key] }}</el-tag>
              </div>
              <el-color-picker
                :model-value="themeVars[v.key]"
                show-alpha
                @change="(val: string | null) => onColorChange(v.key, val)"
              />
            </div>
          </template>

          <!-- 数值滑块类分组（圆角、字体、过渡） -->
          <template
            v-else-if="['radius', 'font', 'transition'].includes(group.id)"
          >
            <div
              v-for="v in getNumericGroupVars(group.id)"
              :key="v.key"
              class="var-row slider-row"
            >
              <div class="var-info">
                <span class="var-label">{{ v.label }}</span>
                <el-tag size="small" type="info">{{ themeVars[v.key] }}</el-tag>
              </div>
              <div class="slider-control">
                <el-slider
                  :model-value="parseFloat(themeVars[v.key])"
                  :min="v.min"
                  :max="v.max"
                  :step="v.step"
                  @input="(val: number | number[]) => onSliderChange(v, val)"
                />
                <el-input-number
                  :model-value="parseFloat(themeVars[v.key])"
                  :min="v.min"
                  :max="v.max"
                  :step="v.step"
                  size="small"
                  controls-position="right"
                  @change="(val: number | undefined) => onSliderChange(v, val)"
                />
              </div>
            </div>
          </template>

          <!-- 文本输入类分组（阴影） -->
          <template v-else-if="group.id === 'shadow'">
            <div
              v-for="v in getTextGroupVars(group.id)"
              :key="v.key"
              class="var-row text-row"
            >
              <div class="var-info">
                <span class="var-label">{{ v.label }}</span>
              </div>
              <el-input
                :model-value="themeVars[v.key]"
                type="textarea"
                :rows="2"
                size="small"
                @change="(val: string) => onTextChange(v.key, val)"
              />
              <div class="shadow-preview" :style="{ boxShadow: themeVars[v.key] }"></div>
            </div>
          </template>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '../composables/useTheme'
import {
  themeGroups,
  primaryColors,
  textColorVars,
  borderColorVars,
  fillColorVars,
  bgColorVars,
  radiusVars,
  fontSizeVars,
  boxShadowVars,
  transitionVars,
  lightLevels,
  darkLevels
} from '../theme/variables'
import type { ColorVar, NumericVar, TextVar } from '../theme/variables'

const { themeVars, setVar, setPrimaryColor, commit } = useTheme()

const activeGroup = ref<string>('colors')

/** 颜色变体项（用于预览展示） */
interface ColorVariant {
  key: string
  label: string
  value: string
}

/** 获取颜色类分组的变量列表 */
function getColorGroupVars(groupId: string): ColorVar[] {
  const map: Record<string, ColorVar[]> = {
    text: textColorVars,
    border: borderColorVars,
    fill: fillColorVars,
    bg: bgColorVars
  }
  return map[groupId] || []
}

/** 获取数值类分组的变量列表 */
function getNumericGroupVars(groupId: string): NumericVar[] {
  const map: Record<string, NumericVar[]> = {
    radius: radiusVars,
    font: fontSizeVars,
    transition: transitionVars
  }
  return map[groupId] || []
}

/** 获取文本类分组的变量列表 */
function getTextGroupVars(groupId: string): TextVar[] {
  const map: Record<string, TextVar[]> = {
    shadow: boxShadowVars
  }
  return map[groupId] || []
}

/** 获取主色变体（用于预览展示） */
function getVariants(colorKey: string): ColorVariant[] {
  const result: ColorVariant[] = []
  for (const { level } of lightLevels) {
    const key = `--el-color-${colorKey}-light-${level}`
    result.push({ key, label: `L${level}`, value: themeVars[key] })
  }
  for (const { level } of darkLevels) {
    const key = `--el-color-${colorKey}-dark-${level}`
    result.push({ key, label: `D${level}`, value: themeVars[key] })
  }
  return result
}

function onPrimaryColorChange(colorKey: string, val: string | null): void {
  if (!val) return
  setPrimaryColor(colorKey, val)
  commit()
}

function onColorChange(key: string, val: string | null): void {
  if (!val) return
  setVar(key, val)
  commit()
}

function onSliderChange(varDef: NumericVar, val: number | number[] | undefined): void {
  if (val == null || Array.isArray(val)) return
  setVar(varDef.key, `${val}${varDef.unit || 'px'}`)
  commit()
}

function onTextChange(key: string, val: string): void {
  setVar(key, val)
  commit()
}
</script>

<style scoped>
.theme-panel {
  height: 100%;
  overflow: hidden;
}

.group-tabs {
  height: 100%;
}

.group-tabs :deep(.el-tabs__content) {
  height: 100%;
  overflow-y: auto;
  padding: 0 20px 20px;
}

/* ===== 左侧导航栏整体 ===== */
.group-tabs :deep(.el-tabs__header) {
  width: 160px;
  margin: 0;
  border-right: 1px solid var(--el-border-color-lighter);
  background: var(--el-fill-color-lighter);
}

.group-tabs :deep(.el-tabs__nav-wrap) {
  width: 100%;
  padding: 8px 0;
}

/* 移除默认右侧指示线，改用自定义左侧指示线 */
.group-tabs :deep(.el-tabs__active-bar) {
  display: none;
}

.group-tabs :deep(.el-tabs__item) {
  text-align: left;
  padding: 0;
  height: auto;
  margin: 2px 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  overflow: hidden;
}

/* ===== 每个导航项 ===== */
.tab-label {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  padding: 10px 14px;
  white-space: nowrap;
  width: 100%;
  position: relative;
  box-sizing: border-box;
}

.tab-label .el-icon {
  font-size: 16px;
  flex-shrink: 0;
}

/* hover 态：浅色背景 */
.group-tabs :deep(.el-tabs__item:hover) {
  background: var(--el-fill-color);
  color: var(--el-color-primary);
}

.group-tabs :deep(.el-tabs__item:hover) .tab-label {
  color: var(--el-color-primary);
}

/* 激活态：主色背景 + 左侧指示线 */
.group-tabs :deep(.el-tabs__item.is-active) {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-weight: 500;
}

.group-tabs :deep(.el-tabs__item.is-active) .tab-label {
  color: var(--el-color-primary);
}

/* 左侧蓝色指示线 */
.group-tabs :deep(.el-tabs__item.is-active) .tab-label::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--el-color-primary);
  border-radius: 0 3px 3px 0;
}

.group-content {
  max-width: 580px;
}

.group-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.group-header h3 {
  font-size: 18px;
  margin-bottom: 6px;
  color: var(--el-text-color-primary);
}

.group-desc {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.var-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--el-border-color-extra-light);
  gap: 16px;
}

.var-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 120px;
}

.var-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.color-row :deep(.el-color-picker__trigger) {
  width: 60px;
  height: 32px;
}

.slider-row {
  flex-wrap: wrap;
}

.slider-control {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 200px;
}

.slider-control .el-slider {
  flex: 1;
}

.text-row {
  flex-direction: column;
  align-items: stretch;
}

.text-row .var-info {
  flex-direction: row;
  justify-content: space-between;
  min-width: auto;
}

.shadow-preview {
  width: 100%;
  height: 40px;
  margin-top: 8px;
  border-radius: var(--el-border-radius-base);
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
}

.variant-preview {
  margin-top: 12px;
}

.variant-group {
  margin-bottom: 16px;
}

.variant-title {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.variant-swatches {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.swatch {
  width: 64px;
  height: 48px;
  border-radius: 6px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 4px;
  border: 1px solid var(--el-border-color-lighter);
}

.swatch-label {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.6);
  background: rgba(255, 255, 255, 0.7);
  padding: 1px 5px;
  border-radius: 3px;
}
</style>
