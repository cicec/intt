import { stringify } from '../utils'
import { Plugin } from '../types'

const tsconfig = () =>
  stringify.json({
    compilerOptions: {
      outDir: './dist/',
      sourceMap: true,
      strict: true,
      noImplicitReturns: true,
      noImplicitAny: true,
      module: 'es6',
      moduleResolution: 'node',
      target: 'es5',
      allowJs: true,
      jsx: 'react'
    },
    include: ['./src/**/*']
  })

const typescript: Plugin = ({ is }) => {
  return {
    condition: is.typescript,
    files: {
      'tsconfig.json': tsconfig()
    },
    package: {
      devDependencies: is.webpack ? ['ts-loader', 'typescript'] : []
    },
    webpack: {
      extensions: ['.ts'],
      rules: [
        {
          test: /\.ts(x)?$/,
          loader: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    }
  }
}

export default typescript
