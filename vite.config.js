import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Electron file:// 에서 type="module" 과 crossorigin 이 ES module CORS를 일으키므로 제거
const fixElectronScript = {
  name: 'fix-electron-script',
  transformIndexHtml(html) {
    return html
      .replace(/\s?crossorigin\b/g, '')
      .replace(/<script\s+type="module"/g, '<script')
  },
}

export default defineConfig({
  plugins: [react(), fixElectronScript],
  base: './',
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
