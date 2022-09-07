module.exports = {
  env: {
    node: true,
  },
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'prettier'
  ],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'prettier',
  ],
  parserOptions: {
    project: `${__dirname}/tsconfig.json`,
  },
  rules: {
    'prettier/prettier': 'error',

    'import/prefer-default-export': 'off',

    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
  },
};
