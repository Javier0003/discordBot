import { join } from 'path'
import Command from '../structures/command-builder'
import { readdirSync } from 'fs'

export default function getLocalCommands(): Command[] | undefined {
    const path = join(__dirname, '../events/commands')
    const localCommands: Command[] = []
    const commands = readdirSync(path)

    for (const command of commands) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Command = require(
        `${path}/${command}`
      ).default
      const commandInstance = new Command()
      if (!commandInstance.command) return

      localCommands.push(commandInstance)
    }

    return localCommands
  }
