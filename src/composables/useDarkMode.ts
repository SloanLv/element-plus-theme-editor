import { ref } from 'vue'

const STORAGE_KEY = 'theme-editor-dark-mode'

/** 读取 localStorage 初始值 */
function getInitialDark(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) return stored === 'true'
  } catch {
    // localStorage 不可用时忽略
  }
  return false
}

/** 编辑器深色模式状态（单例） */
const isDark = ref(getInitialDark())

/** 将深色模式应用到 <html> 并持久化 */
function applyDarkMode(val: boolean): void {
  document.documentElement.classList.toggle('dark', val)
  try {
    localStorage.setItem(STORAGE_KEY, String(val))
  } catch {
    // 忽略写入失败
  }
}

// 初始化时同步一次 DOM 状态
applyDarkMode(isDark.value)

/** View Transitions API 类型声明 */
interface ViewTransition {
  ready: Promise<void>
  finished: Promise<void>
}

export function useDarkMode() {
  /** 切换深色/浅色模式，支持从点击位置开始圆形扩散动画
   * @param event 鼠标点击事件，用于确定动画起始点
   */
  function toggleDark(event?: MouseEvent): void {
    const x = event?.clientX ?? window.innerWidth / 2
    const y = event?.clientY ?? window.innerHeight / 2
    // 计算圆形动画需要覆盖整个屏幕的最大半径
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    // 不支持 View Transitions API 时直接切换
    const startViewTransition = (document as Document & {
      startViewTransition?: (cb: () => void) => ViewTransition
    }).startViewTransition

    if (!startViewTransition) {
      isDark.value = !isDark.value
      applyDarkMode(isDark.value)
      return
    }

    const transition = startViewTransition.call(document, () => {
      isDark.value = !isDark.value
      applyDarkMode(isDark.value)
    })

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 450,
          easing: 'linear',
          pseudoElement: '::view-transition-new(root)'
        }
      )
    }).catch(() => {
      // 用户可能快速连续点击，忽略中断错误
    })
  }

  function setDark(val: boolean): void {
    isDark.value = val
    applyDarkMode(val)
  }

  return { isDark, toggleDark, setDark }
}
