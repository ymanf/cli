import { defineCommand } from 'citty'

import { description, name, version } from '../package.json'
import * as commands from './commands'

export const main = defineCommand({
  meta: {
    name,
    version,
    description,
  },
  subCommands: commands,
  run(ctx) {},
})
