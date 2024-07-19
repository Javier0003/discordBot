import { join } from 'path'
import { CommandConfig } from '../structures/command-builder'
import { readdirSync } from 'fs'

export default function getLocalCommands(): CommandConfig[] | undefined {
    const path = join(__dirname, '../events/commands')
    let localCommands: CommandConfig[] = []
    const commands = readdirSync(path)

    for (const command of commands) {
      const Command = require(
        `${path}/${command}`
      ).default
      const commandInstance = new Command()
      if (!commandInstance.command) return

      localCommands.push(commandInstance)
    }

    return localCommands
  }
