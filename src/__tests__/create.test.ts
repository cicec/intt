import { URL } from 'url'
import { create } from '../create'
import { Answers, Bundler, Feature, Framework, Test } from '../types'

const name = 'intt-app'

jest.mock('axios', () =>
  jest.fn((url: string) => {
    const { pathname } = new URL(url)
    const name = pathname.slice(1, pathname.lastIndexOf('/'))

    return Promise.resolve({ status: 200, data: { name, version: '1.0.0' } })
  })
)

test('Webpack + React + Babel', async () => {
  const answers: Answers = {
    name,
    bundler: Bundler.WEBPACK,
    framework: Framework.REACT,
    features: [Feature.BABEL]
  }

  const files = await create(answers)

  return expect(files).toMatchSnapshot()
})

test('Webpack + React + Babel + Ts', async () => {
  const answers: Answers = {
    name,
    bundler: Bundler.WEBPACK,
    framework: Framework.REACT,
    features: [Feature.BABEL]
  }

  const files = await create(answers)

  return expect(files).toMatchSnapshot()
})

test('Webpack + Vue', async () => {
  const answers: Answers = {
    name,
    bundler: Bundler.WEBPACK,
    framework: Framework.VUE,
    features: []
  }

  const files = await create(answers)

  return expect(files).toMatchSnapshot()
})

test('Webpack + Vue + Babel + Ts', async () => {
  const answers: Answers = {
    name,
    bundler: Bundler.WEBPACK,
    framework: Framework.VUE,
    features: [Feature.BABEL, Feature.TYPESCRIPT]
  }

  const files = await create(answers)

  return expect(files).toMatchSnapshot()
})

test('Snowpack + React', async () => {
  const answers: Answers = {
    name,
    bundler: Bundler.SNOWPACK,
    framework: Framework.REACT,
    features: []
  }

  const files = await create(answers)

  return expect(files).toMatchSnapshot()
})

test('Snowpack + React + Ts', async () => {
  const answers: Answers = {
    name,
    bundler: Bundler.SNOWPACK,
    framework: Framework.REACT,
    features: [Feature.TYPESCRIPT]
  }

  const files = await create(answers)

  return expect(files).toMatchSnapshot()
})

test('Snowpack + Vue', async () => {
  const answers: Answers = {
    name,
    bundler: Bundler.SNOWPACK,
    framework: Framework.VUE,
    features: []
  }

  const files = await create(answers)

  return expect(files).toMatchSnapshot()
})

test('Snowpack + Vue + Ts', async () => {
  const answers: Answers = {
    name,
    bundler: Bundler.SNOWPACK,
    framework: Framework.VUE,
    features: [Feature.TYPESCRIPT]
  }

  const files = await create(answers)

  return expect(files).toMatchSnapshot()
})

test('Webpack + React + Jest', async () => {
  const answers: Answers = {
    name,
    bundler: Bundler.WEBPACK,
    framework: Framework.REACT,
    test: Test.JEST
  }

  const files = await create(answers)

  return expect(files).toMatchSnapshot()
})

test('Webpack + React + AVA', async () => {
  const answers: Answers = {
    name,
    bundler: Bundler.SNOWPACK,
    framework: Framework.VUE,
    test: Test.AVA
  }

  const files = await create(answers)

  return expect(files).toMatchSnapshot()
})
