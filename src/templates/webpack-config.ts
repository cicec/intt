import { execute, has, is, stringify } from '../utils'
import { Answers, MainLibrary } from '../types'

export const webpackConfig = ({ mainLibrary, features }: Answers) => {
  const entry = execute(() => {
    let suffix = 'js'

    if (has.typescript(features)) {
      suffix = 'ts'
    }

    if (mainLibrary === MainLibrary.REACT) {
      suffix += 'x'
    }

    return './src/index.' + suffix
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

    if (is.react(mainLibrary)) {
      rules.push({
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      })
    }

    if (is.vue(mainLibrary)) {
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

    if (has.typescript(features)) {
      rules.push({
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        options: is.vue(mainLibrary)
          ? {
              appendTsSuffixTo: [/\.vue$/]
            }
          : undefined,
        exclude: /node_modules/
      })
    }

    return rules
  })

  const extensions = execute(() => {
    const extensions = ['.js']

    if (is.react(mainLibrary)) {
      extensions.push('.jsx')
    }

    if (is.vue(mainLibrary)) {
      extensions.push('.vue')
    }

    if (has.typescript(features)) {
      extensions.push('.ts')

      if (is.react(mainLibrary)) {
        extensions.push('.tsx')
      }
    }

    return extensions
  })

  const plugins = execute(() => {
    const plugins = []

    if (is.vue(mainLibrary)) {
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
