import { Command } from 'commander'
import { create } from './create'

const program = new Command()

program.name('intt').version(`intt ${require('../package').version}`, '-v, --version')

program.argument('[app]').description('create a new project').action(create)

program.parse(process.argv)
