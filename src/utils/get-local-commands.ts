import { readdir } from 'fs/promises'
import { CommandConfig } from '../structures/command-builder/command-builder'

export default async function getLocalCommands(): Promise<CommandConfig[] | undefined> {
    let localCommands: CommandConfig[] = []
    const commands = await readdir('./src/events/commands')

    for (const command of commands) {
      const { default: Command } = await import(
        `../events/commands/${command}`
      )
      const commandInstance = new Command()
      if (!commandInstance.command) return

      localCommands.push(commandInstance)
    }

    return localCommands
  }
