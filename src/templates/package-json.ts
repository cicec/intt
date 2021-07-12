import axios from 'axios'
import ora from 'ora'
import { execute, has, is, stringify } from '../utils'
import { Answers } from '../types'

type Dependency = string | { name: string; version: string }

const mapVersions = async (deps: Dependency[]) => {
  // TODO: customize the default mirror
  const mirror = 'https://registry.npm.taobao.org'

  const spinner = ora().start()

  const versions = await Promise.all(
    deps
      .map(dep => (typeof dep === 'string' ? { name: dep, version: 'latest' } : dep))
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map(async ({ name, version }) => {
        spinner.text = name
        const { status, data } = await axios(`${mirror}/${name}/${version}`)

        if (status === 200 && data) {
          return { name: data.name, version: '^' + data.version }
        }

        throw `Request failed of '${name}'`
      })
  )

  spinner.stop()

  return versions.reduce((acc, { name, version }) => ({ ...acc, ...{ [name]: version } }), {})
}

export const packageJson = async ({ name, bundler, mainLibrary, features }: Answers) => {
  const scripts = execute(() => {
    if (is.snowpack(bundler)) {
      return {
        'start': 'snowpack dev',
        'build': 'snowpack build'
      }
    }

    if (is.webpack(bundler)) {
      return {
        'start': 'webpack serve --mode development',
        'build': 'webpack --mode production'
      }
    }

    return {}
  })

  const dependencies = await execute(() => {
    const deps: Dependency[] = []

    if (is.react(mainLibrary)) {
      deps.push('react', 'react-dom')
    }

    if (is.vue(mainLibrary)) {
      deps.push({ name: 'vue', version: 'next' })
    }

    return mapVersions(deps)
  })

  const devDependencies = await execute(() => {
    const deps: Dependency[] = []

    if (has.typescript(features)) {
      deps.push('typescript')
    }

    if (is.react(mainLibrary)) {
      if (has.typescript(features)) {
        deps.push('@types/react', '@types/react-dom')
      }
    }

    if (is.webpack(bundler)) {
      deps.push('webpack', 'webpack-cli', 'webpack-dev-server')

      if (has.babel(features)) {
        deps.push('babel-loader', '@babel/core', '@babel/preset-env')
      }

      if (is.react(mainLibrary)) {
        deps.push('@babel/preset-react')
      }

      if (is.vue(mainLibrary)) {
        deps.push('vue-loader', 'vue-template-compiler', '@vue/compiler-sfc')
      }

      if (has.typescript(features)) {
        deps.push('ts-loader')
      }
    }

    if (is.snowpack(bundler)) {
      deps.push('snowpack')

      if (is.vue(mainLibrary)) {
        deps.push('@snowpack/plugin-vue')
      }
    }

    return mapVersions(deps)
  })

  return stringify.json({
    name,
    version: '1.0.0',
    description: '',
    main: 'index.js',
    keywords: [],
    author: '',
    license: 'MIT',
    scripts,
    dependencies,
    devDependencies
  })
}
