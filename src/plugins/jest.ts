import { dedent } from 'ts-dedent'
import { CLIOptions } from '../types'

const testSample = () => dedent`
  test('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3);
  });
`

export default ({ is }: CLIOptions) => {
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
