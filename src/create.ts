import { execute, getCLIOptions, mergeDeepWith } from './utils'
import { PluginConfig, Files, Answers } from './types'

import plugins from './plugins'
import {
  generateBabel,
  generatePackage,
  generateWebpack,
  generateGitignore,
  generateSnowpack
} from './generate'

export const create = async (answers: Answers) => {
  const options = getCLIOptions(answers)
  const { name, is } = options

  const config = execute(() => {
    return plugins
      .map(plugin => plugin(options))
      .filter(({ condition }) => condition)
      .reduce<PluginConfig>((acc, elem) => {
        const isArr = (x: unknown) => Array.isArray(x)

        return mergeDeepWith((_, a, b) => (isArr(a) && isArr(b) ? [...a, ...b] : b), acc, elem)
      }, {})
  })

  const files: Files = {
    ...config.files,
    '.gitignore': generateGitignore(),
    'package.json': await generatePackage(name, config.package)
  }

  const append = (fileMap: { [x: string]: string }) => Object.assign(files, fileMap)

  if (is.babel) {
    append({ '.babelrc': generateBabel(config.babel) })
  }

  if (is.snowpack) {
    append({ 'snowpack.config.json': generateSnowpack(config.snowpack) })
  }

  if (is.webpack) {
    append({ 'webpack.config.js': generateWebpack(config.webpack) })
  }

  return files
}
