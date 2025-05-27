import eslint from '@eslint/js'
import eslintPluginNext from '@next/eslint-plugin-next'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import * as eslintPluginImport from 'eslint-plugin-import'
import tseslint from 'typescript-eslint'

/**
 * @type {import("eslint").Linter.Config}
 */
export default tseslint.config([
  {
    ignores: ['**/node_modules', '**/.turbo', '**/dist', '**/.next', '**/temp'],
  },
  {
    plugins: {
      import: eslintPluginImport,
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      '@next/next': eslintPluginNext,
    },
  },
  {
    name: 'global-tuning',
    extends: [eslint.configs.recommended],
    rules: {
      'import/order': 'error',
      'import/no-self-import': 'error',
      'import/no-import-module-exports': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    name: 'for-typescript',
    files: ['**/*.ts', '**/*.tsx'],
    extends: [
      tseslint.configs.strict,
      eslintPluginReact.configs.flat.recommended,
      eslintPluginReact.configs.flat['jsx-runtime'],
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-namespace': 'off',
      'react/prop-types': 'off',
      ...eslintPluginReactHooks.configs.recommended.rules,
    },
  },
  {
    name: 'for-nextjs',
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      ...eslintPluginNext.configs.recommended.rules,
      ...eslintPluginNext.configs['core-web-vitals'].rules,
    },
  },
])
