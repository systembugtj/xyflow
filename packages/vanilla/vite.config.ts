import { defineConfig } from 'vite';
import { wsx } from '@wsxjs/wsx-vite-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'XYFlowVanilla',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['@xyflow/system', '@wsxjs/wsx-core'],
      output: {
        globals: {
          '@xyflow/system': 'XYFlowSystem',
          '@wsxjs/wsx-core': 'WSXCore',
        },
      },
    },
    cssCodeSplit: false, // 禁用CSS代码分割，确保CSS内联到JS中
    sourcemap: process.env.NODE_ENV === 'development', // 只在开发环境生成 source maps
  },
  plugins: [
    wsx({
      debug: true,
      jsxFactory: 'jsx',
      jsxFragment: 'Fragment',
    }),
  ],
});
