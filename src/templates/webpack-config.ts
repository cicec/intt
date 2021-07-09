import { execute, stringify } from '../utils'
import { Answers, MainLibrary } from '../types'

export const webpackConfig = ({ mainLibrary }: Answers) => {
  const entry = execute(() => {
    let entry = './src/index.js'

    if (mainLibrary === MainLibrary.REACT) {
      return entry + 'x'
    }

    return entry
  })

  const imports = execute(() => {
    const imports = [`const path = require('path')`]

    if (mainLibrary === MainLibrary.VUE) {
      imports.push(`const { VueLoaderPlugin } = require('vue-loader')`)
    }

    return imports.join('\n')
  })

  const rules = execute(() => {
    const rules = []

    if (mainLibrary === MainLibrary.REACT) {
      rules.push({
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      })
    }

    if (mainLibrary === MainLibrary.VUE) {
      rules.push(
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /node_modules/
        }
      )
    }

    return rules
  })

  const extensions = execute(() => {
    const extensions = ['.js']

    if (mainLibrary === MainLibrary.REACT) {
      extensions.push('.jsx')
    }

    if (mainLibrary === MainLibrary.VUE) {
      extensions.push('.vue')
    }

    return extensions
  })

  const plugins = execute(() => {
    const plugins = []

    if (mainLibrary === MainLibrary.VUE) {
      plugins.push('CODE:new VueLoaderPlugin()')
    }

    return plugins
  })

  const config = execute(() => {
    return {
      entry,
      output: {
        path: `CODE:path.resolve(__dirname, 'dist')`,
        filename: 'bundle.js'
      },
      module: {
        rules
      },
      resolve: {
        extensions
      },
      plugins,
      devServer: {
        contentBase: './dist'
      }
    }
  })

  return `${imports}
  
const config = ${stringify.js(config)}

module.exports = config
`
}
