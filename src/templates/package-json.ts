import axios from 'axios'
import ora from 'ora'
import { command, execute, stringify } from '../utils'
import { Answers, MainLibrary } from '../types'

type Dependency = string | { name: string; version: string }

const mapVersions = async (deps: Dependency[]) => {
  const register = await execute(async () => {
    const { stdout } = await command(`npm config get register`)
    return stdout.replace(/\n$/, '')
  })

  const spinner = ora().start()

  const versions = await Promise.all(
    deps
      .map(dep => (typeof dep === 'string' ? { name: dep, version: 'latest' } : dep))
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map(async ({ name, version }) => {
        spinner.text = name
        const { status, data } = await axios(`${register}/${name}/${version}`)

        if (status === 200 && data) {
          return { name: data.name, version: '^' + data.version }
        }

        throw `Request failed of '${name}'`
      })
  )

  spinner.stop()

  return versions.reduce((acc, { name, version }) => ({ ...acc, ...{ [name]: version } }), {})
}

export const packageJson = async ({ name, mainLibrary }: Answers) => {
  const scripts = execute(() => {
    return {
      'start': 'webpack serve --mode development',
      'build': 'webpack --mode production'
    }
  })

  const dependencies = await execute(() => {
    const deps: Dependency[] = []

    if (mainLibrary === MainLibrary.REACT) {
      deps.push('react', 'react-dom')
    }

    if (mainLibrary === MainLibrary.VUE) {
      deps.push({ name: 'vue', version: 'next' })
    }

    return mapVersions(deps)
  })

  const devDependencies = await execute(() => {
    const deps = [
      'webpack',
      'webpack-cli',
      'webpack-dev-server',
      'babel-loader',
      '@babel/core',
      '@babel/preset-env'
    ]

    if (mainLibrary === MainLibrary.REACT) {
      deps.push('@babel/preset-react')
    }

    if (mainLibrary === MainLibrary.VUE) {
      deps.push('vue-loader', 'vue-template-compiler', '@vue/compiler-sfc')
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
