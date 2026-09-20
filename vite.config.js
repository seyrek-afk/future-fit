import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Uygulama çalışma zamanında hiçbir yere bağlanmaz: veri data/*.json'dan build'e gömülür,
// harici font/CDN yoktur. Bu yapılandırmaya ağ gerektiren hiçbir eklenti eklenmemelidir.
export default defineConfig({
  plugins: [react()],
  server: { port: 3002, strictPort: true },
  preview: { port: 3002, strictPort: true },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Tek sayfalık uygulama; veri JSON'ları küçük, ayrı chunk'a bölmeye gerek yok.
    chunkSizeWarningLimit: 900,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.test.{js,jsx}'],
    restoreMocks: true,
    css: false,
  },
})
