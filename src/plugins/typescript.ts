import { stringify } from '../utils'
import { Plugin } from '../types'

const reactApp = () => `import React from 'react'

interface Props {
  name: string
}

const App = (props: Props) => (
  <>
    <h1>Hello {props.name}</h1>
  </>
)

export default App
`

const reactIndex = () => `import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

var mountNode = document.getElementById('app')
ReactDOM.render(<App name="Jane" />, mountNode)
`

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
      devDependencies: ['typescript'].concat(is.webpack ? ['ts-loader'] : [])
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
