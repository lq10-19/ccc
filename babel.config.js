const is_prod = process.env.NODE_ENV === 'production'
let transformRemoveConsolePlugin = []
if (is_prod) {
  transformRemoveConsolePlugin.unshift(
    ["transform-remove-console", {
      "exclude": ["error", "warn"]
    }]
  )
}
module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: transformRemoveConsolePlugin
}