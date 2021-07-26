import fs from 'fs'
import path from 'path'
import prompts from 'prompts'
import { red } from 'kolorist'
import { execute, foreach, is, mergeDeepWith } from './utils'
import { Answers, MainLibrary, Bundler, Features, PluginConfig, Files } from './types'

import plugins from './plugins'
import {
  generateBabel,
  generatePackage,
  generateWebpack,
  generateGitignore,
  generateSnowpack
} from './generate'

const writeFiles = async (fileMap: Files, dir: string) => {
  fs.mkdirSync(dir)

  foreach((value, key) => {
    if (typeof value === 'string') {
      fs.writeFileSync(path.resolve(dir, key), value)
    }

    if (typeof value === 'object') {
      writeFiles(value, path.resolve(dir, key))
    }
  }, fileMap)
}

export const create = async (name = '') =>
  prompts(
    [
      {
        type: name ? null : 'text',
        name: 'name',
        message: 'Project Name: ',
        initial: 'intt-app',
        onState: ({ value }) => (name = value)
      },
      {
        type: name && fs.existsSync(path.resolve(process.cwd(), name)) ? 'confirm' : null,
        name: 'overwrite',
        message: `Directory already exists, remove it and continue?`,
        initial: false
      },
      {
        type: (_, { overwrite }) => {
          if (overwrite === false) {
            throw new Error(red('✖') + ' Operation cancelled')
          }
          return null
        },
        name: 'overwriteChecker'
      },
      {
        type: 'select',
        name: 'bundler',
        message: 'Select a module bundler: ',
        choices: [
          { title: 'Webpack', value: Bundler.WEBPACK },
          { title: 'Snowpack', value: Bundler.SNOWPACK }
        ]
      },
      {
        type: 'select',
        name: 'mainLibrary',
        message: 'Select a main library: ',
        choices: [
          { title: 'React', value: MainLibrary.REACT },
          { title: 'Vue', value: MainLibrary.VUE }
        ]
      },
      {
        type: 'multiselect',
        name: 'features',
        message: 'Select the features needed: ',
        instructions: false,
        hint: '- Space to select. Return to submit',
        choices: (_, answers) => {
          const choices = []

          if (is.webpack(answers)) {
            choices.push({ title: 'Babel', value: Features.BABEL, selected: is.react(answers) })
          }
          choices.push({ title: 'Typescript', value: Features.TYPESCRIPT })

          return choices
        }
      }
    ],
    {
      onCancel: () => {
        throw new Error(red('✖') + ' Operation cancelled')
      }
    }
  )
    .then(async answers => {
      const config = execute((answers: Answers) => {
        return plugins
          .map(plugin => plugin(answers))
          .filter(({ condition }) => condition)
          .reduce<PluginConfig>((acc, elem) => {
            const isArr = (x: unknown) => Array.isArray(x)

            return mergeDeepWith((_, a, b) => (isArr(a) && isArr(b) ? [...a, ...b] : b), acc, elem)
          }, {})
      }, answers)

      const files = await execute(async () => {
        const files: Files = {
          ...config.files,
          '.gitignore': generateGitignore(),
          'package.json': await generatePackage(name, config.package)
        }

        const append = (fileMap: { [x: string]: string }) => Object.assign(files, fileMap)

        if (is.babel(answers)) {
          append({ '.babelrc': generateBabel(config.babel) })
        }

        if (is.snowpack(answers)) {
          append({ 'snowpack.config.json': generateSnowpack(config.snowpack) })
        }

        if (is.webpack(answers)) {
          append({ 'webpack.config.js': generateWebpack(config.webpack) })
        }

        return files
      })

      const root = path.resolve(process.cwd(), name)

      if (fs.existsSync(root)) {
        fs.rmSync(root, { recursive: true })
      }

      await writeFiles(files, root)

      console.log(`🎉 Done!`)
    })
    .catch(e => console.log(e.message))
