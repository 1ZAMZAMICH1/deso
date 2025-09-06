// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import cesium from 'vite-plugin-cesium'; // 1. Импортируй плагин cesium

export default defineConfig({
  plugins: [
    react(), 
    svgr(),
    cesium() // 2. Добавь вызов плагина сюда
  ],
});