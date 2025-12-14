import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import globals from 'globals';
import ts from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import turbo from 'eslint-config-turbo';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import wsxPlugin from '@wsxjs/eslint-plugin-wsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default [
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...ts.configs.recommended,
  prettier,
  turbo,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        // WSX 特定的全局变量
        NodeListOf: 'readonly',
        h: 'readonly',
        Fragment: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      // TypeScript handles this
      'no-undef': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx,js,jsx,wsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        jsxPragma: 'h',
        jsxFragmentName: 'Fragment',
        experimentalDecorators: true, // Required for @state decorator
        extraFileExtensions: ['.wsx'],
        projectService: {
          allowDefaultProject: ['*.wsx'],
        },
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        h: 'readonly',
        Fragment: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      wsx: wsxPlugin,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      // WSX plugin rules
      'wsx/render-method-required': 'error',
      'wsx/no-react-imports': 'error',
      'wsx/web-component-naming': 'warn',
      'wsx/state-requires-initial-value': 'error',
    },
  },
];
