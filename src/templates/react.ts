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

var mountNode = document.getElementById('app')
ReactDOM.render(<App name="Jane" />, mountNode)
`
