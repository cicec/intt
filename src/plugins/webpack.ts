import { generateHtml } from '../generate'
import { Plugin } from '../types'
import { is } from '../utils'

const webpack: Plugin = answers => {
  return {
    condition: is.webpack(answers),
    files: {
      dist: {
        'index.html': generateHtml()
      }
    },
    package: {
      scripts: {
        start: 'webpack serve --mode development',
        build: 'webpack --mode production'
      },
      devDependencies: ['webpack', 'webpack-cli', 'webpack-dev-server']
    }
  }
}

export default webpack
