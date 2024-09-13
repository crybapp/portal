import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [{
  ignores: ['dist/', 'node_modules/'],
}, ...compat.extends(
  'eslint:recommended',
  'plugin:@typescript-eslint/recommended',
  'plugin:@typescript-eslint/stylistic'
), {

  languageOptions: {
    globals: {
      ...globals.node,
    },
  },

  rules: {
    'comma-spacing': 'error',
    'comma-style': 'error',
    'eol-last': ['error', 'always'],
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],

    'max-nested-callbacks': ['error', {
      max: 4,
    }],

    'max-statements-per-line': ['error', {
      max: 2,
    }],

    'no-multi-spaces': 'error',

    'no-multiple-empty-lines': ['error', {
      max: 2,
      maxEOF: 1,
      maxBOF: 0,
    }],

    'no-trailing-spaces': ['error'],
    'no-var': 'error',
    'object-curly-spacing': ['error', 'always'],
    'prefer-const': 'error',
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'space-before-blocks': 'error',
    'spaced-comment': 'error',
    yoda: 'error',
  },
}]
