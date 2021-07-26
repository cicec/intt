import { generateHtml } from '../generate'
import { Plugin } from '../types'

const snowpack: Plugin = ({ name, is }) => {
  return {
    condition: is.snowpack,
    files: {
      src: {
        'index.html': generateHtml({ name, isModule: true })
      }
    },
    package: {
      scripts: {
        start: 'snowpack dev',
        build: 'snowpack build'
      },
      devDependencies: ['snowpack']
    },
    snowpack: {
      mount: {
        dist: '/',
        src: '/'
      }
    }
  }
}

export default snowpack
