import { dedent } from 'ts-dedent'
import { Plugin } from '../types'

const testSample = () => dedent`
  const test = require('ava')
  
  test('foo', t => {
    t.pass()
  })

  test('bar', async t => {
    const bar = Promise.resolve('bar')
    t.is(await bar, 'bar')
  })
`

const testConfig = () => dedent`
  export default {
    files: ['tests/**/*']
  }
`

const ava: Plugin = ({ is }) => {
  return {
    condition: is.ava,
    files: {
      tests: {
        'index.test.js': testSample()
      },
      'ava.config.js': testConfig()
    },
    package: {
      scripts: {
        test: 'ava'
      },
      devDependencies: ['ava']
    }
  }
}

export default ava
