import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        // 分包策略：将第三方库拆分为独立 chunk，避免单个文件过大
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            // element-plus 与 @element-plus/icons-vue 存在循环依赖，合并为一个 chunk
            if (id.includes('element-plus')) return 'element-plus'
            // Vue 运行时单独分包
            if (id.includes('@vue') || id.includes('/vue/')) return 'vue-vendor'
          }
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
