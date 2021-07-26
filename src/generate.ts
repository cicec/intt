import axios from 'axios'
import ora from 'ora'
import { dedent } from 'ts-dedent'
import { BabelConfig, PackageConfig, SnowpackConfig, WebpackConfig } from './types'
import { stringify, uniq, uniqBy } from './utils'

const parseVersion = (pkg: string): [string, string] => {
  const idx = pkg.lastIndexOf('@')

  if (idx <= 0) {
    return [pkg, 'latest']
  }
  return [pkg.slice(0, idx), pkg.slice(idx + 1)]
}

const mapVersions = async (pkgs: string[]) => {
  // TODO: customize the default mirror
  const mirror = 'https://registry.npm.taobao.org'

  const spinner = ora().start()

  const versions = await Promise.all(
    pkgs.sort().map(async pkg => {
      const [name, version] = parseVersion(pkg)
      spinner.text = name
      const { status, data } = await axios(`${mirror}/${name}/${version}`)

      if (status === 200 && data) {
        return { [data.name]: '^' + data.version }
      }

      throw `Request failed of '${name}'`
    })
  )

  spinner.stop()

  return versions.reduce((acc, elem) => ({ ...acc, ...elem }), {})
}

export const generatePackage = async (name: string, config: PackageConfig = {}) => {
  const scripts = config.scripts ?? {}
  const dependencies = await mapVersions(config.dependencies ?? [])
  const devDependencies = await mapVersions(config.devDependencies ?? [])

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

export const generateWebpack = ({
  prefix = [],
  entry = './src/index.js',
  extensions = [],
  rules = [],
  plugins = []
}: WebpackConfig = {}) => {
  const config = {
    entry,
    output: {
      path: `CODE:path.resolve(__dirname, 'dist')`,
      filename: 'index.js'
    },
    devServer: {
      contentBase: './dist'
    },
    resolve: {
      extensions: uniq(['.js', ...extensions])
    },
    module: {
      rules: uniqBy(({ loader }) => loader, rules.reverse())
    },
    plugins
  }

  return dedent`
    const path = require('path')
    ${prefix.join('\n')}

    const config = ${stringify.js(config)}

    module.exports = config
`
}

export const generateSnowpack = (config: SnowpackConfig = {}) => stringify.json(config)

export const generateBabel = (config: BabelConfig = {}) => stringify.json(config)

export const generateHtml = ({ name = 'app', isModule = false } = {}) => dedent`
  <!DOCTYPE html>
  <html>
    <head>
      <title>${name}</title>
      <meta charset="utf-8" />
    </head>
    <body>
      <div id="app"></div>
      <script ${isModule ? `type="module" ` : ``}src="index.js"></script>
    </body>
  </html>
`

export const generateGitignore = () => dedent`
  .cache/
  coverage/
  dist/*
  !dist/index.html
  node_modules/
  *.log

  # OS generated files
  .DS_Store
  .DS_Store?
  ._*
  .Spotlight-V100
  .Trashes
  ehthumbs.db
  Thumbs.db
`
