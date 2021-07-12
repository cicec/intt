import fs from 'fs'
import path from 'path'
import prompts from 'prompts'
import { red } from 'kolorist'
import { execute, foreach, is } from './utils'
import { reactApp, reactIndex } from './templates/react'
import { vueApp, vueIndex } from './templates/vue'
import { packageJson } from './templates/package-json'
import { webpackConfig } from './templates/webpack-config'
import { snowpackConfig } from './templates/snowpack-config'
import { babelrc, gitignore, html } from './templates/base'
import { Answers, MainLibrary, Bundler } from './types'

type FileMap = { [key: string]: string | FileMap | undefined }

const writeFiles = async (fileMap: FileMap, dir: string) => {
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
        initial: 'app',
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
      }
    ],
    {
      onCancel: () => {
        throw new Error(red('✖') + ' Operation cancelled')
      }
    }
  )
    .then(async answers => {
      const { bundler, mainLibrary } = answers

      const dist = is.webpack(bundler) ? { 'index.html': html({ name }) } : undefined

      const src = execute(() => {
        const fileMap: FileMap = {}

        if (is.snowpack(bundler)) {
          Object.assign(fileMap, {
            'index.html': html({ name, bundleFilename: 'index.js', isModule: true })
          })
        }

        if (is.react(mainLibrary)) {
          Object.assign(fileMap, { 'App.jsx': reactApp(), 'index.jsx': reactIndex() })
        }

        if (is.vue(mainLibrary)) {
          Object.assign(fileMap, { 'App.vue': vueApp(), 'index.js': vueIndex() })
        }

        return fileMap
      })

      const fileMap: FileMap = {
        dist,
        src,
        '.babelrc': babelrc(answers),
        '.gitignore': gitignore(),
        'package.json': await packageJson(answers),
        'webpack.config.js': is.webpack(bundler) ? webpackConfig(answers) : undefined,
        'snowpack.config.json': is.snowpack(bundler) ? snowpackConfig(answers) : undefined
      }

      const root = path.resolve(process.cwd(), name)

      if (fs.existsSync(root)) {
        fs.rmSync(root, { recursive: true })
      }

      await writeFiles(fileMap, root)

      console.log(`🎉 Done!`)
    })
    .catch(e => console.log(e.message))
