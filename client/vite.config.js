import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
export default defineConfig({
plugins: [react()],
server: {
host: true, // cho phép truy cập từ bên ngoài (Codespaces)
allowedHosts: ['.app.github.dev'],
// mọi request /api/... được chuyển sang backend
proxy: { '/api': 'http://127.0.0.1:5000' },
},
})