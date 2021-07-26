import { execute } from '../utils'
import { Plugin } from '../types'

const babel: Plugin = ({ is }) => {
  const devDependencies = execute(() => {
    const result = ['@babel/core', '@babel/preset-env']

    if (is.webpack) {
      result.push('babel-loader')
    }
    return result
  })

  return {
    condition: is.babel,
    package: {
      devDependencies
    },
    babel: {
      presets: [['@babel/preset-env', { modules: false }]]
    },
    webpack: {
      rules: [
        {
          test: /\.js(x)?$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    }
  }
}

export default babel
