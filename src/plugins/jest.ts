import { dedent } from 'ts-dedent'
import { Plugin } from '../types'

const testSample = () => dedent`
  test('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3);
  });
`

const jest: Plugin = ({ is }) => {
  return {
    condition: is.jest,
    files: {
      tests: {
        'index.test.js': testSample()
      },
      'jest.config.js': ''
    },
    package: {
      scripts: {
        test: 'jest'
      },
      devDependencies: ['jest']
    }
  }
}

export default jest
