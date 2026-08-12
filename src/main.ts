import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import type { Component } from 'vue'
import App from './App.vue'
import './styles/global.css'

// 仅注册 themeGroups 中通过 <component :is> 动态引用的图标（9 个）
// 其余图标在各组件中按需 import，由 Vite 自动 tree-shake
import {
  Brush,
  Document,
  Grid,
  MagicStick,
  Picture,
  ChromeFilled,
  EditPen,
  Sunny,
  Timer
} from '@element-plus/icons-vue'

const app = createApp(App)

const dynamicIcons: Record<string, Component> = {
  Brush,
  Document,
  Grid,
  MagicStick,
  Picture,
  ChromeFilled,
  EditPen,
  Sunny,
  Timer
}

for (const [key, component] of Object.entries(dynamicIcons)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.mount('#app')
