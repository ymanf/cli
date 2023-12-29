import { defineCommand } from 'citty'
import type { CommandContext } from 'citty'
import consola from 'consola'
import { downloadTemplate, startShell } from 'giget'
import { resolve } from 'path'

import { config } from '../../config'
import { sharedArgs } from './_shared'

export const init = defineCommand({
  meta: {
    name: 'Init new app',
    description: 'Initialize a new app wth a template',
  },
  args: {
    ...sharedArgs,
    template: {
      type: 'string',
      alias: 't',
      description: `Template name. Example: ${config.commands.init.defaultTemplate}`,
    },
    name: {
      type: 'string',
      alias: 'n',
      description: 'App name',
    },
    force: {
      type: 'boolean',
      alias: 'f',
      description: 'Override existing directory',
    },
    offline: {
      type: 'boolean',
      description: 'Force offline mode',
    },
    preferOffline: {
      type: 'boolean',
      description: 'Prefer offline mode',
    },
  },
  subCommands: {},
  async run(ctx) {
    consola.start('Initializing new app...')

    consola.start('Download the starter template')
    const template = await getTemplate(ctx as CommandContext)
    consola.success('Starter template downloaded')

    if (ctx.args.shell) {
      startShell(template.dir)
    }

    consola.success('Your application is ready for development!')
  },
})

async function getTemplate(ctx: CommandContext) {
  const cwd = resolve((ctx.args.cwd as string) || '.')
  const dir = (ctx.args.dir as string) || '.'
  const templateName = (ctx.args.template as string) || config.commands.init.defaultTemplate

  try {
    return downloadTemplate(templateName, {
      dir,
      cwd,
      force: Boolean(ctx.args.force),
      offline: Boolean(ctx.args.offline),
      preferOffline: Boolean(ctx.args.preferOffline),
    })
  } catch (err) {
    consola.error((err as Error).toString())
    process.exit(1)
  }
}
