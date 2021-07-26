import { execute, is } from '../utils'
import { Plugin } from '../types'

const babel: Plugin = answers => {
  const devDependencies = execute(() => {
    const result = ['@babel/core', '@babel/preset-env']

    if (is.webpack(answers)) {
      result.push('babel-loader')
    }
    return result
  })

  return {
    condition: is.babel(answers),
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
