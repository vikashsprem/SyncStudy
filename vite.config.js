import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // For sockjs-client compatibility
      'sockjs-client': 'sockjs-client/dist/sockjs.min.js',
    }
  },
  define: {
    // For @stomp/stompjs and SockJS compatibility
    global: 'globalThis',
    'process.env': {},
  },
})
