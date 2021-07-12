export const reactApp = () => `import React from 'react'

class App extends React.Component {
  render() {
    const { name } = this.props
    return (
      <>
        <h1>Hello {name}</h1>
      </>
    )
  }
}

export default App
`

export const reactIndex = () => `import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const mountNode = document.getElementById('app')
ReactDOM.render(<App name="Jane" />, mountNode)
`

export const reactAppTs = () => `import * as React from 'react'

interface Props {
  name: string
}

class App extends React.Component<Props> {
  render() {
    const { name } = this.props
    return (
      <>
        <h1>Hello {name}</h1>
      </>
    )
  }
}

export default App
`

export const reactIndexTs = () => `import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'

const mountNode = document.getElementById('app')
ReactDOM.render(<App name="Jane" />, mountNode)
`
