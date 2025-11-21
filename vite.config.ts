import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Lấy port từ env hoặc default 5173
const PORT = process.env.PORT || 5173;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,              // cho phép truy cập bên ngoài
    // port: PORT,              // port dev server
    strictPort: false,       // nếu port 5173 đang dùng, tự tăng
    open: true,              // mở trình duyệt tự động
    allowedHosts: true,      // cho phép tất cả host (ngrok)
  },
});
