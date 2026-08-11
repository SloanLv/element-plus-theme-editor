/**
 * Element Plus 主题变量定义
 * 包含所有可编辑的 CSS 变量，按分组组织
 */

// ===== 类型定义 =====

/** 主色配置项 */
export interface PrimaryColor {
  key: string
  label: string
  value: string
}

/** 颜色级别（用于生成浅色/深色变体） */
export interface ColorLevel {
  level: number
  percent: number
}

/** 颜色变量定义 */
export interface ColorVar {
  key: string
  label: string
  value: string
}

/** 数值型变量定义（圆角、字体、过渡） */
export interface NumericVar {
  key: string
  label: string
  value: string
  min: number
  max: number
  step: number
  unit: string
}

/** 文本型变量定义（阴影） */
export interface TextVar {
  key: string
  label: string
  value: string
}

/** 所有变量定义的联合类型 */
export type ThemeVar = ColorVar | NumericVar | TextVar

/** 主题变量键值对 */
export type ThemeVars = Record<string, string>

/** 编辑器分组配置 */
export interface ThemeGroup {
  id: string
  title: string
  icon: string
  desc: string
}

// ===== 颜色混合工具 =====

type RGB = [number, number, number]

/** 将颜色与白色/黑色混合，生成浅色/深色变体。支持 hex(#rrggbb / #rgb)、rgb()、rgba() 格式 */
export function mixColor(color: string, percent: number, withColor = '#ffffff'): string {
  const parseColor = (input: string): RGB => {
    const str = input.trim()
    // hex 格式: #rgb / #rrggbb / #rrggbbaa
    if (str.startsWith('#')) {
      let h = str.slice(1)
      if (h.length === 3) {
        h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
      } else if (h.length === 8) {
        h = h.slice(0, 6) // 忽略 alpha 通道
      }
      return [
        parseInt(h.substring(0, 2), 16) || 0,
        parseInt(h.substring(2, 4), 16) || 0,
        parseInt(h.substring(4, 6), 16) || 0
      ]
    }
    // rgb() / rgba() 格式
    const match = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i)
    if (match) {
      return [
        parseInt(match[1], 10),
        parseInt(match[2], 10),
        parseInt(match[3], 10)
      ]
    }
    return [255, 255, 255]
  }
  const c1 = parseColor(color)
  const c2 = parseColor(withColor)
  const r = Math.round(c1[0] * (1 - percent) + c2[0] * percent)
  const g = Math.round(c1[1] * (1 - percent) + c2[1] * percent)
  const b = Math.round(c1[2] * (1 - percent) + c2[2] * percent)
  const toHex = (n: number): string => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// ===== 主色调配置 =====

/** 主色调：编辑基础色后自动生成 light-3 ~ light-9 和 dark-2 变体 */
export const primaryColors: PrimaryColor[] = [
  { key: 'primary', label: '主要色 Primary', value: '#409eff' },
  { key: 'success', label: '成功色 Success', value: '#67c23a' },
  { key: 'warning', label: '警告色 Warning', value: '#e6a23c' },
  { key: 'danger', label: '危险色 Danger', value: '#f56c6c' },
  { key: 'error', label: '错误色 Error', value: '#f56c6c' },
  { key: 'info', label: '信息色 Info', value: '#909399' }
]

/** 主色变体百分比（Element Plus 标准） */
export const lightLevels: ColorLevel[] = [
  { level: 3, percent: 0.3 },
  { level: 5, percent: 0.5 },
  { level: 7, percent: 0.7 },
  { level: 8, percent: 0.8 },
  { level: 9, percent: 0.9 }
]
export const darkLevels: ColorLevel[] = [{ level: 2, percent: 0.2 }]

/** 根据基础色生成所有 CSS 变量键值对 */
export function generateColorVars(baseKey: string, baseColor: string): ThemeVars {
  const vars: ThemeVars = { [`--el-color-${baseKey}`]: baseColor }
  for (const { level, percent } of lightLevels) {
    vars[`--el-color-${baseKey}-light-${level}`] = mixColor(baseColor, percent)
  }
  for (const { level, percent } of darkLevels) {
    vars[`--el-color-${baseKey}-dark-${level}`] = mixColor(baseColor, percent, '#000000')
  }
  return vars
}

// ===== 颜色变量分组 =====

/** 文本颜色组 */
export const textColorVars: ColorVar[] = [
  { key: '--el-text-color-primary', label: '主要文字', value: '#303133' },
  { key: '--el-text-color-regular', label: '常规文字', value: '#606266' },
  { key: '--el-text-color-secondary', label: '次要文字', value: '#909399' },
  { key: '--el-text-color-placeholder', label: '占位文字', value: '#a8abb2' },
  { key: '--el-text-color-disabled', label: '禁用文字', value: '#c0c4cc' }
]

/** 边框颜色组 */
export const borderColorVars: ColorVar[] = [
  { key: '--el-border-color', label: '基础边框', value: '#dcdfe6' },
  { key: '--el-border-color-light', label: '浅色边框', value: '#e4e7ed' },
  { key: '--el-border-color-lighter', label: '更浅边框', value: '#ebeef5' },
  { key: '--el-border-color-extra-light', label: '极浅边框', value: '#f2f6fc' },
  { key: '--el-border-color-dark', label: '深色边框', value: '#d4d7de' },
  { key: '--el-border-color-darker', label: '更深边框', value: '#cdd0d6' }
]

/** 填充颜色组 */
export const fillColorVars: ColorVar[] = [
  { key: '--el-fill-color', label: '基础填充', value: '#f0f2f5' },
  { key: '--el-fill-color-light', label: '浅色填充', value: '#f5f7fa' },
  { key: '--el-fill-color-lighter', label: '更浅填充', value: '#fafafa' },
  { key: '--el-fill-color-extra-light', label: '极浅填充', value: '#fafcff' },
  { key: '--el-fill-color-dark', label: '深色填充', value: '#ebedf0' },
  { key: '--el-fill-color-darker', label: '更深填充', value: '#e6e8eb' },
  { key: '--el-fill-color-blank', label: '空白填充', value: '#ffffff' }
]

/** 背景颜色组 */
export const bgColorVars: ColorVar[] = [
  { key: '--el-bg-color', label: '基础背景', value: '#ffffff' },
  { key: '--el-bg-color-page', label: '页面背景', value: '#f2f3f5' },
  { key: '--el-bg-color-overlay', label: '覆盖层背景', value: '#ffffff' }
]

/** 边框圆角组 */
export const radiusVars: NumericVar[] = [
  { key: '--el-border-radius-base', label: '基础圆角', value: '4px', min: 0, max: 30, step: 1, unit: 'px' },
  { key: '--el-border-radius-small', label: '小圆角', value: '2px', min: 0, max: 20, step: 1, unit: 'px' },
  { key: '--el-border-radius-round', label: '圆形圆角', value: '20px', min: 0, max: 50, step: 1, unit: 'px' }
]

/** 字体大小组 */
export const fontSizeVars: NumericVar[] = [
  { key: '--el-font-size-extra-large', label: '特大字体', value: '20px', min: 14, max: 32, step: 1, unit: 'px' },
  { key: '--el-font-size-large', label: '大字体', value: '18px', min: 12, max: 28, step: 1, unit: 'px' },
  { key: '--el-font-size-medium', label: '中字体', value: '16px', min: 12, max: 24, step: 1, unit: 'px' },
  { key: '--el-font-size-base', label: '基础字体', value: '14px', min: 10, max: 22, step: 1, unit: 'px' },
  { key: '--el-font-size-small', label: '小字体', value: '13px', min: 10, max: 20, step: 1, unit: 'px' },
  { key: '--el-font-size-extra-small', label: '特小字体', value: '12px', min: 10, max: 18, step: 1, unit: 'px' }
]

/** 阴影组 */
export const boxShadowVars: TextVar[] = [
  { key: '--el-box-shadow', label: '基础阴影', value: '0px 12px 32px 4px rgba(0,0,0,.04), 0px 8px 20px rgba(0,0,0,.08)' },
  { key: '--el-box-shadow-light', label: '轻阴影', value: '0px 0px 12px rgba(0,0,0,.12)' },
  { key: '--el-box-shadow-lighter', label: '更轻阴影', value: '0px 0px 6px rgba(0,0,0,.12)' },
  { key: '--el-box-shadow-dark', label: '深阴影', value: '0px 16px 48px 16px rgba(0,0,0,.08), 0px 12px 32px rgba(0,0,0,.12), 0px 8px 16px -8px rgba(0,0,0,.16)' }
]

/** 过渡时间组 */
export const transitionVars: NumericVar[] = [
  { key: '--el-transition-duration', label: '过渡时长', value: '0.3s', min: 0, max: 2, step: 0.05, unit: 's' },
  { key: '--el-transition-duration-fast', label: '快速过渡', value: '0.2s', min: 0, max: 2, step: 0.05, unit: 's' }
]

// ===== 主题生成 =====

/** 生成完整的默认主题变量对象 */
export function getDefaultTheme(): ThemeVars {
  const theme: ThemeVars = {}
  // 主色及其变体
  for (const c of primaryColors) {
    Object.assign(theme, generateColorVars(c.key, c.value))
  }
  // 其他分组
  const colorGroups: ColorVar[][] = [textColorVars, borderColorVars, fillColorVars, bgColorVars]
  for (const group of colorGroups) {
    for (const v of group) {
      theme[v.key] = v.value
    }
  }
  for (const v of radiusVars) theme[v.key] = v.value
  for (const v of fontSizeVars) theme[v.key] = v.value
  for (const v of boxShadowVars) theme[v.key] = v.value
  for (const v of transitionVars) theme[v.key] = v.value
  return theme
}

/** 编辑器分组配置（用于 UI 渲染） */
export const themeGroups: ThemeGroup[] = [
  { id: 'colors', title: '主题色', icon: 'Brush', desc: '设置主要、成功、警告等基础色，浅色/深色变体会自动生成' },
  { id: 'text', title: '文字颜色', icon: 'Document', desc: '控制各级文字的颜色层次' },
  { id: 'border', title: '边框颜色', icon: 'Grid', desc: '边框线的颜色层次' },
  { id: 'fill', title: '填充颜色', icon: 'MagicStick', desc: '组件内部填充背景色' },
  { id: 'bg', title: '背景颜色', icon: 'Picture', desc: '页面和组件背景色' },
  { id: 'radius', title: '圆角', icon: 'ChromeFilled', desc: '组件边框圆角大小' },
  { id: 'font', title: '字体大小', icon: 'EditPen', desc: '各级文字字号' },
  { id: 'shadow', title: '阴影', icon: 'Sunny', desc: '阴影效果' },
  { id: 'transition', title: '过渡动画', icon: 'Timer', desc: '动画过渡时长' }
]
