import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 相对路径，便于部署到 GitHub Pages 等子路径
  plugins: [vue()],
})
