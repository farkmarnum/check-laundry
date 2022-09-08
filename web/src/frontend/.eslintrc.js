module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: `${__dirname}/tsconfig.json`,
  },
  plugins: ['prettier'],
  extends: [
    'preact',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  ignorePatterns: [
    'build/'
  ],
  rules: {
    "prettier/prettier": "error",
  },
}