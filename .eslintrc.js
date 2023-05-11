module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    indent: ['error', 2],
    curly: 'error',
    'no-empty': 'error',
    'no-extra-semi': 'error',
    'no-redeclare': 'error',
    'eol-last': 'error',
    'comma-dangle': [
      'error',
      {
        objects: 'always-multiline',
        imports: 'always-multiline',
        arrays: 'ignore',
      },
    ],
    'no-trailing-spaces': 'error',
    'dot-notation': ['warn'],
    'new-cap': 'warn',
    'no-use-before-define': 'warn',
    '@typescript-eslint/no-var-requires': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    'prettier/prettier': ['off'], // override prettier rules
  },
  parser: '@typescript-eslint/parser',
};
