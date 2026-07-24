import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    target: ['es2020', 'chrome80', 'safari13', 'edge80', 'firefox80'],
    cssTarget: ['chrome80', 'safari13', 'edge80', 'firefox80']
  }
})
