const isProduction = process.env.NODE_ENV === 'production'
module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    sourceType: 'module',
  },
  // https://github.com/standard/standard/blob/master/docs/README-en.md
  // We override some rules:
  // * Trailing commas: always
  // * Space before function paren: never
  extends: ['standard', 'plugin:vue/recommended', 'prettier'],
  plugins: ['vue', 'html', 'prettier'],
  rules: {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-debugger': isProduction ? 2 : 0,
    'space-before-function-paren': [isProduction ? 'error' : 'warn', 'never'],

    'prettier/prettier': [
      isProduction ? 'error' : 'warn',
      {
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: true,
        jsxBracketSameLine: true,
        parser: 'babylon',
        semi: false,
      },
    ],
  },
}
