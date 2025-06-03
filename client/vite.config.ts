import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React와 관련 라이브러리를 별도 청크로 분리
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // 차트 관련 라이브러리를 별도 청크로 분리
          'vendor-charts': ['chart.js', 'react-chartjs-2', 'recharts'],
          // UI 관련 라이브러리를 별도 청크로 분리
          'vendor-ui': ['@heroicons/react', 'framer-motion', 'react-datepicker'],
          // 유틸리티 라이브러리를 별도 청크로 분리
          'vendor-utils': ['axios', 'date-fns']
        }
      }
    },
    // 청크 크기 경고 임계값을 1000KB로 증가
    chunkSizeWarningLimit: 1000
  }
})