import globals from 'globals';
import tsEslint from 'typescript-eslint';
import pluginJs from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import importPlugin from 'eslint-plugin-import';

export default defineConfig([
  globalIgnores(['dist', 'package-lock.json']),
  pluginJs.configs.recommended,
  tsEslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: { globals: globals.node },
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          pathGroupsExcludedImportTypes: ['builtin'],
          groups: [
            ['builtin'],
            ['external'],
            ['internal'],
            ['parent'],
            ['sibling', 'index'],
          ],
          'newlines-between': 'always',
        },
      ],
      'import/newline-after-import': 'error',
      'no-console': 'error',
    },
  },
]);
