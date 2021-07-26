import { generateHtml } from '../generate'
import { Plugin } from '../types'
import { is } from '../utils'

const snowpack: Plugin = answers => {
  const { name } = answers

  return {
    condition: is.snowpack(answers),
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
