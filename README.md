# Element Plus 主题编辑器

一个基于 Vue 3 + TypeScript + Vite + Element Plus 的**主题在线编辑器**，支持实时编辑 Element Plus 的 CSS 变量并导出主题文件，内置深色/浅色模式切换。

## 功能特性

- **实时编辑**：通过颜色选择器、滑块等控件修改 Element Plus 的 CSS 变量，所见即所得
- **完整变量覆盖**：支持主题色、文字、边框、填充、背景、圆角、字体、阴影、过渡动画等 9 大分组
- **主色变体自动生成**：编辑基础色后，自动计算 light-3 ~ light-9 和 dark-2 变体
- **多格式颜色支持**：颜色混合算法兼容 `#hex`、`rgb()`、`rgba()` 三种格式
- **深色 / 浅色模式切换**：
  - 一键切换编辑器 UI 和预览区的深色（`#141414`）/ 浅色（`#fff`）主题
  - 深色模式下默认主题自动使用 Element Plus 官方深色变量值
  - 主色变体在深色模式下自动反转混合方向（light-* 与黑色混合，dark-2 与白色混合）
  - 主题偏好通过 `localStorage` 持久化，刷新页面自动恢复
- **实时组件预览**：内置按钮、标签、输入框、表格、分页等十余种组件的实时预览
- **撤销 / 重做**：支持操作历史回退（最多 50 步）
- **导入 / 导出**：
  - 导出为 **CSS 变量文件**（`.css`）
  - 导出为 **SCSS 变量文件**（`.scss`）
  - 导出为 **JSON 配置**（`.json`），可重新导入恢复
  - 从 JSON 文件导入主题

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 构建生产版本
npm run build
```

启动后浏览器会自动打开 `http://localhost:5173`。

## 使用方式

1. 在左侧编辑面板选择分组（主题色、文字、边框等）
2. 修改颜色或数值，右侧预览区实时反映变化
3. 点击工具栏太阳/月亮图标切换深色/浅色模式，编辑器和预览区同步切换
4. 满意后点击右上角「导出主题」
5. 选择格式（CSS / SCSS / JSON），可预览代码或直接下载

### 深色 / 浅色模式

| 操作 | 效果 |
|------|------|
| 点击工具栏太阳/月亮图标 | 编辑器 UI 与预览区同步切换深色/浅色主题 |
| 切换模式时 | 预览区主题自动重置为对应模式的默认值，撤销历史清空 |
| 深色模式下编辑主色 | 变体自动按深色规则生成（light-* 更暗，dark-2 更亮） |
| 深色模式下点击「重置」| 重置为深色模式默认主题（非浅色默认值） |
| 刷新页面 | 自动恢复上次的模式偏好（localStorage 持久化） |

**架构设计**：编辑器 UI 使用 Element Plus 内置深色模式（`html.dark` 类），预览区主题变量独立作用于 `.preview-panel` 元素，两者互不干扰。切换模式时预览区重置为对应模式的默认主题值。

## 在项目中应用导出的主题

### 方式一：CSS 变量（推荐）

将导出的 `element-plus-theme.css` 引入项目：

```ts
// main.ts
import 'element-plus/dist/index.css'
import './element-plus-theme.css' // 你的自定义主题
```

CSS 变量会自动覆盖 Element Plus 默认主题，无需重新编译。

### 方式二：SCSS 变量

将导出的 `element-plus-theme.scss` 引入项目：

```scss
// 通过 @use 覆盖 Element Plus 的 SCSS 变量
@use './element-plus-theme.scss' as *;
```

### 方式三：JSON 导入回编辑器

将导出的 JSON 文件通过编辑器「导入」按钮重新加载，可继续编辑。

## 技术栈

- Vue 3.4+（Composition API + `<script setup lang="ts">`）
- TypeScript 5.4+（strict 模式）
- Vite 5
- Element Plus 2.7+（含内置深色模式 CSS）
- @element-plus/icons-vue
- vue-tsc（Vue SFC 类型检查）

## TypeScript 类型架构

项目全面采用 TypeScript，核心类型定义如下：

| 类型 | 文件 | 说明 |
|------|------|------|
| `ThemeVars` | `theme/variables.ts` | 主题变量键值对 `Record<string, string>` |
| `PrimaryColor` | `theme/variables.ts` | 主色配置项（key / label / value） |
| `ColorVar` | `theme/variables.ts` | 颜色变量定义 |
| `NumericVar` | `theme/variables.ts` | 数值型变量（含 min / max / step / unit） |
| `TextVar` | `theme/variables.ts` | 文本型变量（阴影等） |
| `ThemeGroup` | `theme/variables.ts` | 编辑器分组配置 |
| `UseThemeReturn` | `composables/useTheme.ts` | useTheme composable 返回值类型 |
| `ExportFormat` | `utils/export.ts` | 导出格式联合类型 `'css' \| 'scss' \| 'json'` |

## 项目结构

```
src/
├── main.ts                  # 应用入口（引入 Element Plus + 深色模式 CSS）
├── App.vue                  # 主布局（工具栏 + 编辑区 + 预览区 + 深色切换）
├── env.d.ts                 # TypeScript 环境声明（Vite / Vue SFC）
├── components/
│   ├── ThemePanel.vue       # 主题编辑面板（颜色/滑块控件）
│   ├── PreviewPanel.vue     # 组件实时预览面板（背景跟随深色模式）
│   └── ExportDialog.vue     # 导出对话框
├── composables/
│   ├── useTheme.ts          # 主题状态管理（应用变量/撤销重做/导入/模式切换）
│   └── useDarkMode.ts       # 深色模式状态管理（localStorage 持久化）
├── theme/
│   └── variables.ts         # 变量定义、类型接口、颜色混合算法、深色默认值
├── utils/
│   └── export.ts            # 导出工具（CSS/SCSS/JSON 生成与下载）
└── styles/
    └── global.css           # 全局样式（含深色模式适配）
```

## 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（HMR 热更新） |
| `npm run build` | 类型检查 + 生产构建 |
| `npm run type-check` | 仅运行 TypeScript 类型检查 |
| `npm run preview` | 预览生产构建产物 |

## 浏览器兼容性

支持所有支持 CSS 变量（Custom Properties）的现代浏览器：
Chrome 49+、Firefox 31+、Safari 9.1+、Edge 16+
