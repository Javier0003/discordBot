import appCommands from '../../utils/app-commands'
import Event_Builder from '../../structures/event-builder'
import getLocalCommands from '../../utils/get-local-commands'
import env from '../../env'

export default class RegisterCommands extends Event_Builder {
  constructor() {
    super({ type: 'ready' })
    this.event()
  }

  private async event(): Promise<void> {
    try {
      const localCommands = getLocalCommands()
      const applicationCommands = await appCommands(env.guildId)

      if (!localCommands) return
      if (!applicationCommands) return

      for (const localCommand of localCommands) {
        const { name, description, options } = localCommand

        if (!process.env.REGISTER_ALL) {
          if (localCommand.notUpdated) {
            // console.log(
            //   `⏩ Skipping registering command "${name}" as it's set to not update.`
            // )
            continue
          }
        }

        await applicationCommands.create({
          name,
          description,
          options
        })

        console.log(`👍 Registered command ${name}.`)
      }
    } catch (error) {
      console.log(error)
    }
  }
}
