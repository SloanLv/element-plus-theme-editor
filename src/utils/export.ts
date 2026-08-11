/**
 * 主题导出工具
 * 支持导出 CSS、SCSS、JSON 三种格式
 */

import type { ThemeVars } from '../theme/variables'

/** 导出格式 */
export type ExportFormat = 'css' | 'scss' | 'json'

/** 导出的 JSON 数据结构 */
interface ThemeJsonData {
  name: string
  description: string
  generatedAt: string
  variables: ThemeVars
}

/** 将主题变量对象转为 CSS 字符串 */
export function exportCSS(themeVars: ThemeVars): string {
  const lines: string[] = []
  lines.push('/* Element Plus 自定义主题 - 由主题编辑器生成 */')
  lines.push(':root {')
  for (const [key, value] of Object.entries(themeVars)) {
    lines.push(`  ${key}: ${value};`)
  }
  lines.push('}')
  return lines.join('\n')
}

/** 将主题变量对象转为 SCSS 变量字符串 */
export function exportSCSS(themeVars: ThemeVars): string {
  const lines: string[] = []
  lines.push('// Element Plus 自定义主题 - 由主题编辑器生成')
  lines.push('// 在项目中通过 @use 引入此文件即可覆盖默认变量')
  lines.push('')
  for (const [key, value] of Object.entries(themeVars)) {
    const scssName = key.replace(/^--el-/, '$')
    lines.push(`${scssName}: ${value};`)
  }
  lines.push('')
  lines.push(':root {')
  for (const [key, value] of Object.entries(themeVars)) {
    const scssName = key.replace(/^--el-/, '$')
    lines.push(`  ${key}: #{${scssName}};`)
  }
  lines.push('}')
  return lines.join('\n')
}

/** 将主题变量对象转为 JSON 字符串 */
export function exportJSON(themeVars: ThemeVars): string {
  const data: ThemeJsonData = {
    name: 'custom-element-plus-theme',
    description: 'Element Plus 自定义主题',
    generatedAt: new Date().toISOString(),
    variables: themeVars
  }
  return JSON.stringify(data, null, 2)
}

/** 触发文件下载 */
export function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/** 根据格式导出 */
export function exportTheme(format: ExportFormat, themeVars: ThemeVars): void {
  let content = ''
  let filename = ''
  switch (format) {
    case 'css':
      content = exportCSS(themeVars)
      filename = 'element-plus-theme.css'
      break
    case 'scss':
      content = exportSCSS(themeVars)
      filename = 'element-plus-theme.scss'
      break
    case 'json':
      content = exportJSON(themeVars)
      filename = 'element-plus-theme.json'
      break
    default:
      content = exportCSS(themeVars)
      filename = 'element-plus-theme.css'
  }
  downloadFile(content, filename)
}
