import fs from 'fs'
import path from 'path'
import prompts from 'prompts'
import { red } from 'kolorist'
import { execute, foreach } from './utils'
import { reactApp, reactIndex } from './templates/react'
import { vueApp, vueIndex } from './templates/vue'
import { packageJson } from './templates/package-json'
import { webpackConfig } from './templates/webpack-config'
import { babelrc, gitignore, html } from './templates/base'
import { MainLibrary } from './types'

type FileMap = { [key: string]: string | FileMap }

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

execute(async () => {
  const answers = await prompts(
    [
      {
        type: 'text',
        name: 'name',
        message: 'Project Name: '
      },
      {
        type: name => (fs.existsSync(path.resolve(process.cwd(), name)) ? 'confirm' : null),
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

  const { name, mainLibrary } = answers

  const src = execute(() => {
    if (mainLibrary === MainLibrary.REACT) {
      return { 'App.jsx': reactApp(), 'index.jsx': reactIndex() }
    }

    if (mainLibrary === MainLibrary.VUE) {
      return { 'App.vue': vueApp(), 'index.js': vueIndex() }
    }

    return {} as FileMap
  })

  const fileMap: FileMap = {
    dist: {
      'index.html': html(answers)
    },
    src,
    '.babelrc': babelrc(answers),
    '.gitignore': gitignore(),
    'package.json': await packageJson(answers),
    'webpack.config.js': webpackConfig(answers)
  }

  const root = path.resolve(process.cwd(), name)

  if (fs.existsSync(root)) {
    fs.rmSync(root, { recursive: true })
  }

  await writeFiles(fileMap, root)

  console.log(`🎉 Done!`)
}).catch(e => {
  console.log(e.message)
})
