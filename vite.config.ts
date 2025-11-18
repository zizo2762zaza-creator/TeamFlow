import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // أثناء التطوير يمكن توجيه /api إلى vercel dev أو مباشرة إلى GAS (لكن direct => CORS)
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000', // إذا شغّلت `vercel dev` على الـ port هذا
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
