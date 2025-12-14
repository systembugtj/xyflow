import { defineConfig } from 'vite';
import { wsx } from '@wsxjs/wsx-vite-plugin';
import { resolve } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    // wsx 插件必须在最前面，确保优先处理 .wsx 文件
    wsx({
      debug: true, // 启用调试以查看哪些文件被处理
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      // 处理所有 .wsx 文件，包括通过 alias 导入的
    }),
  ],
  optimizeDeps: {
    // 排除 @xyflow/vanilla，让 wsx 插件直接处理
    // 注意：必须排除整个包，否则 Vite 会在 wsx 插件处理之前预构建
    exclude: ['@xyflow/vanilla'],
    // 强制包含 wsx-core 以确保正确解析
    include: ['@wsxjs/wsx-core'],
    // 禁用预构建，确保所有文件都通过 wsx 插件处理
    disabled: false,
  },
  build: {
    sourcemap: process.env.NODE_ENV !== 'production', // No source maps in production
  },
  // 确保 .wsx 文件不被 esbuild 处理，只由 wsx 插件处理
  esbuild: {
    exclude: /\.wsx$/,
  },
  resolve: {
    alias: [
      // CSS 文件需要特殊处理，放在前面优先匹配
      {
        find: /^@xyflow\/vanilla\/dist\/(.*\.css)$/,
        replacement: resolve(__dirname, '../../packages/vanilla/dist/$1'),
      },
      // 其他 @xyflow/vanilla 导入指向源文件
      // index.ts 中已经直接导入了所有 .wsx 文件，确保 wsx 插件能处理它们
      {
        find: /^@xyflow\/vanilla$/,
        replacement: resolve(__dirname, '../../packages/vanilla/src/index.ts'),
      },
      // @xyflow/system 指向源文件
      {
        find: /^@xyflow\/system$/,
        replacement: resolve(__dirname, '../../packages/system/src/index.ts'),
      },
    ],

    // 确保 .wsx 扩展名被正确识别
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.wsx', '.json'],
  },

  server: {
    port: 3001,
    open: true,
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['../..'],
    },
  },
});
