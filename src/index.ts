import fs from 'fs'
import path from 'path'
import { Command } from 'commander'
import { prompt } from './prompt'
import { create } from './create'
import { writeFiles } from './utils'
import packageJson from '../package.json'

const program = new Command()

program.name('intt').version(`intt ${packageJson.version}`, '-v, --version')

program
  .argument('[app]')
  .description('create a new project')
  .action(async name => {
    try {
      const answers = await prompt(name)
      const files = await create(answers)

      const root = path.resolve(process.cwd(), name ?? answers.name)

      if (fs.existsSync(root)) {
        fs.rmSync(root, { recursive: true })
      }

      await writeFiles(files, root)

      console.log(`🎉 Done!`)
    } catch (e) {
      console.log(e.message)
    }
  })

program.parse(process.argv)
