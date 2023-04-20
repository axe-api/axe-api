module.exports = {
  root: true,
  extends: [
    'semistandard',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: [
    '@typescript-eslint',
    'prettier',
  ],
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    indent: ['error', 2],
    curly: 'error',
    'no-empty': 'error',
    'no-extra-semi': 'error',
    'no-redeclare': 'error',
    'eol-last': 'error',
    'comma-dangle': ["error", {
      "objects": "always-multiline",
  }],
    'no-trailing-spaces': 'error',
    'dot-notation': ['warn'],
    'new-cap': 'warn',
    'no-use-before-define': 'warn',
    'prettier/prettier': ['error'],
  },
  parser: '@typescript-eslint/parser',
}

