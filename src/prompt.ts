import fs from 'fs'
import path from 'path'
import prompts from 'prompts'
import { red } from 'kolorist'
import { getCLIOptions } from './utils'
import { Framework, Bundler, Feature } from './types'

export const prompt = (name?: string) =>
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
        name: 'framework',
        message: 'Select a framework: ',
        choices: [
          { title: 'React', value: Framework.REACT },
          { title: 'Vue', value: Framework.VUE }
        ]
      },
      {
        type: 'multiselect',
        name: 'features',
        message: 'Select the features needed: ',
        instructions: false,
        hint: '- Space to select. Return to submit',
        choices: (_, answers) => {
          const { is } = getCLIOptions(answers)
          const choices = []

          if (is.webpack) {
            choices.push({ title: 'Babel', value: Feature.BABEL, selected: is.react })
          }
          choices.push({ title: 'Typescript', value: Feature.TYPESCRIPT })

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
