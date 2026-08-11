import { reactive } from 'vue'
import { getDefaultTheme, generateColorVars } from '../theme/variables'
import type { ThemeVars } from '../theme/variables'

/** 主题 JSON 导入数据结构 */
interface ThemeImportData {
  variables?: ThemeVars
  [key: string]: unknown
}

/** useTheme 返回值类型 */
export interface UseThemeReturn {
  themeVars: ThemeVars
  setVar: (key: string, value: string) => void
  setPrimaryColor: (colorKey: string, baseColor: string) => void
  resetTheme: () => void
  undo: () => void
  redo: () => void
  importTheme: (data: ThemeImportData | ThemeVars) => void
  commit: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

/**
 * 主题状态管理（单例 composable）
 * 所有组件共享同一份响应式主题数据
 */
const themeVars = reactive<ThemeVars>(getDefaultTheme())
const history: ThemeVars[] = []
let historyIndex = -1

/** 将主题变量应用到 :root */
function applyTheme(): void {
  const root = document.documentElement
  for (const [key, value] of Object.entries(themeVars)) {
    root.style.setProperty(key, value)
  }
}

/** 记录历史快照（用于撤销） */
function snapshot(): ThemeVars {
  return JSON.parse(JSON.stringify(themeVars))
}

function pushHistory(): void {
  // 截断当前索引之后的历史
  history.splice(historyIndex + 1)
  history.push(snapshot())
  if (history.length > 50) history.shift()
  historyIndex = history.length - 1
}

// 初始化时记录一次
pushHistory()

export function useTheme(): UseThemeReturn {
  /** 更新单个变量 */
  function setVar(key: string, value: string): void {
    themeVars[key] = value
    applyTheme()
  }

  /** 更新主色（含自动生成的变体） */
  function setPrimaryColor(colorKey: string, baseColor: string): void {
    const vars = generateColorVars(colorKey, baseColor)
    Object.assign(themeVars, vars)
    applyTheme()
  }

  /** 重置为默认主题 */
  function resetTheme(): void {
    const def = getDefaultTheme()
    Object.keys(themeVars).forEach((k) => delete themeVars[k])
    Object.assign(themeVars, def)
    applyTheme()
    pushHistory()
  }

  /** 撤销 */
  function undo(): void {
    if (historyIndex > 0) {
      historyIndex--
      Object.keys(themeVars).forEach((k) => delete themeVars[k])
      Object.assign(themeVars, history[historyIndex])
      applyTheme()
    }
  }

  /** 重做 */
  function redo(): void {
    if (historyIndex < history.length - 1) {
      historyIndex++
      Object.keys(themeVars).forEach((k) => delete themeVars[k])
      Object.assign(themeVars, history[historyIndex])
      applyTheme()
    }
  }

  /** 从 JSON 导入主题 */
  function importTheme(data: ThemeImportData | ThemeVars): void {
    const vars = (data as ThemeImportData).variables || (data as ThemeVars)
    Object.keys(themeVars).forEach((k) => delete themeVars[k])
    Object.assign(themeVars, vars)
    applyTheme()
    pushHistory()
  }

  /** 提交一次编辑（记录历史） */
  function commit(): void {
    pushHistory()
  }

  const canUndo = (): boolean => historyIndex > 0
  const canRedo = (): boolean => historyIndex < history.length - 1

  return {
    themeVars,
    setVar,
    setPrimaryColor,
    resetTheme,
    undo,
    redo,
    importTheme,
    commit,
    canUndo,
    canRedo
  }
}
