module.exports = {
  parserOptions: {
    ecmaVersion: 6
  },
  env: {
    commonjs: true,
    node: true,
    es6: true,
    mocha: true
  },
  extends: 'eslint:recommended',
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-console': [
      'warn',
      { allow: ['clear', 'info', 'error', 'dir', 'trace'] }
    ],
    curly: 'error',
    'no-else-return': 'error',
    'no-unneeded-ternary': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    'one-var': ['error', 'never'],
    'prefer-arrow-callback': 'error',
    'symbol-description': 'error',
    yoda: ['error', 'never', { exceptRange: true }],
    'prefer-const': 'error',
    'newline-per-chained-call': 1
  }
};
