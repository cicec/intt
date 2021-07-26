import { generateHtml } from '../generate'
import { Plugin } from '../types'

const webpack: Plugin = ({ is }) => {
  return {
    condition: is.webpack,
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
