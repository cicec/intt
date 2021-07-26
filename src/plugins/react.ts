import { dedent } from 'ts-dedent'
import { execute } from '../utils'
import { Plugin } from '../types'

const reactApp = () => dedent`
  import React from 'react'

  const App = props => (
    <>
      <h1>Hello {props.name}</h1>
    </>
  )

  export default App
`

const reactAppTs = () => dedent`
  import * as React from 'react'

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

const reactIndex = () => dedent`
  import React from 'react'
  import ReactDOM from 'react-dom'
  import App from './App'

  var mountNode = document.getElementById('app')
  ReactDOM.render(<App name="Jane" />, mountNode)
`

const reactIndexTs = () => dedent`
  import * as React from 'react'
  import * as ReactDOM from 'react-dom'
  import App from './App'

  const mountNode = document.getElementById('app')
  ReactDOM.render(<App name="Jane" />, mountNode)
`

const react: Plugin = ({ is }) => {
  const src = execute(() => {
    if (is.typescript) {
      return {
        'App.tsx': reactAppTs(),
        'index.tsx': reactIndexTs()
      }
    }

    return {
      'App.jsx': reactApp(),
      'index.jsx': reactIndex()
    }
  })

  const devDependencies = execute(() => {
    const result = []
    if (is.typescript) {
      result.push('@types/react', '@types/react-dom')
    }

    if (is.babel) {
      result.push('@babel/preset-react')
    }

    return result
  })

  return {
    condition: is.react,
    files: {
      src
    },
    package: {
      dependencies: ['react', 'react-dom'],
      devDependencies
    },
    babel: {
      presets: ['@babel/preset-react']
    },
    webpack: {
      entry: './src/index.' + (is.typescript ? 'tsx' : 'jsx'),
      extensions: ['.jsx', '.tsx']
    }
  }
}

export default react
