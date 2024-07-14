import appCommands from '../../utils/app-commands'
import Event_Builder from '../../structures/event-builder/event-builder'
import getLocalCommands from '../../utils/get-local-commands'
import env from '../../env'

export default class RegisterCommands extends Event_Builder {
  constructor() {
    super({ type: 'ready' })
    this.event()
  }

  private async event(): Promise<void> {
    try {
      const localCommands = await getLocalCommands()
      const applicationCommands = await appCommands(env.guildId)

      if (!localCommands) return
      if (!applicationCommands) return

      for (const localCommand of localCommands) {
        const { name, description, options } = localCommand
        const existingCommand = await applicationCommands.cache.find(
          (cmd) => cmd.name === name
        )

        if (existingCommand) {
          if (localCommand.deleted) {
            await applicationCommands.delete(existingCommand.id)
            console.log(`🗑 Deleted command "${name}".`)
            continue
          }

          if (this.areCommandsDifferent(existingCommand, localCommand)) {
            await applicationCommands.edit(existingCommand.id, {
              description,
              options
            })

            console.log(`🔁 Edited command "${name}".`)
          }
        } else {
          if (localCommand.deleted) {
            console.log(
              `⏩ Skipping registering command "${name}" as it's set to delete.`
            )
            continue
          }
          
          await applicationCommands.create({
            name,
            description,
            options,
          })

          console.log(`👍 Registered command ${name}.`)
        }
      }
    } catch (error) {
      console.log(`There was an error: ${error}`)
    }
  }

  private areCommandsDifferent(existingCommand: any, localCommand: any) {
    const areChoicesDifferent = (existingChoices: any, localChoices: any) => {
      for (const localChoice of localChoices) {
        const existingChoice = existingChoices?.find(
          (choice: any) => choice.name === localChoice.name
        )

        if (!existingChoice) {
          return true
        }

        if (localChoice.value !== existingChoice.value) {
          return true
        }
      }
      return false
    }

    const areOptionsDifferent = (existingOptions: any, localOptions: any) => {
      for (const localOption of localOptions) {
        const existingOption = existingOptions?.find(
          (option: any) => option.name === localOption.name
        )

        if (!existingOption) {
          return true
        }

        if (
          localOption.description !== existingOption.description ||
          localOption.type !== existingOption.type ||
          (localOption.required || false) !== existingOption.required ||
          (localOption.choices?.length || 0) !==
            (existingOption.choices?.length || 0) ||
          areChoicesDifferent(
            localOption.choices || [],
            existingOption.choices || []
          )
        ) {
          return true
        }
      }
      return false
    }

    if (
      existingCommand.description !== localCommand.description ||
      existingCommand.options?.length !== (localCommand.options?.length || 0) ||
      areOptionsDifferent(existingCommand.options, localCommand.options || [])
    ) {
      return true
    }

    return false
  }
}
