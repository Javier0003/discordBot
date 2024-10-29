import appCommands from '../../utils/app-commands'
import Event_Builder from '../../structures/event-builder'
import getLocalCommands from '../../utils/get-local-commands'
import env from '../../env'

export default class RegisterCommands extends Event_Builder<'ready'> {
  constructor() {
    super({ eventType: 'ready', type: 'on' })
    this.event()
  }

  public async event(): Promise<void> {
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
    } catch (_) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      _;
    }
  }
}
