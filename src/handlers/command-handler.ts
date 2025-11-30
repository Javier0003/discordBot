import { CacheType, Collection, CommandInteraction, MessageFlags, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes, SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js'
import Command from '../builders/command-builder'
import LoaSingleton from '../structures/loa-client'
import getLocalCommands from '../utils/get-local-commands'
import env from '../env'
import { option } from '../builders/option-builder'

export default class CommandHandler extends LoaSingleton {
  private commands: Collection<string, { command: Command }>

  constructor() {
    super()
    this.commands = new Collection<string, { command: Command }>()
  }

  getCmd(interaction: CommandInteraction<CacheType>) {
    const cmd = this.commands.get(interaction.commandName)
    if (!cmd) {
      throw new Error(`Cmd not found ${interaction.commandName}`)
    }
    return cmd
  }

  async executeCommand(interaction: CommandInteraction<CacheType>) {
    try {
      const cmd = this.getCmd(interaction)
      if (cmd.command.devOnly) {
        const userId = interaction.user.id
        
        const dev = await this.loa.repositories.serverUsersRepository.isDev(userId)

        if (!dev) {
          interaction.reply({
            content: "This command is only available for developers.",
            flags: MessageFlags.Ephemeral
          })
          return
        }
      }

      //@ts-expect-error this is in a parent class so it's always defined
      await cmd.command.execute(interaction)
    } catch (error) {
      console.log(`[CommandHandler] [${interaction.commandName}] ${error}`)
      interaction.editReply("An error occured while executing the command.")
    }
  }

  public async loadCommands(): Promise<void> {
    const localCommands = getLocalCommands()!
    const commands: { [key: string]: Command[] } = {}

    for (const command of localCommands) {
      if (!command.command) continue
      const commandName = command.name
      if (!commands[commandName]) commands[commandName] = []
      commands[commandName].push(command)
    }

    for (const key in commands) {
      const command = commands[key]
      for (const cmd of command) {
        this.commands.set(cmd.name, {
          command: cmd,
        })
      }
    }

    console.log("Commands loaded")
  }

  private formatCommands(): RESTPostAPIChatInputApplicationCommandsJSONBody[] {
    return this.commands
      .map(({ command }) => {
        const slash = new SlashCommandBuilder()
          .setName(command.name)
          .setDescription(command.description)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((command._optionList as any)?.length) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this.optionBuilder(command._optionList as any, slash)
        }
        return slash.toJSON()
      })
  }


  public async registerCommands(): Promise<void> {
    const guilds = await this.loa.guilds.fetch()

    const commands = this.formatCommands()

    try {
      console.log("Started refreshing application (/) commands.")
      const requests = guilds.map(async (guild) => {
        new REST()
          .setToken(env.token)
          .put(
            Routes.applicationGuildCommands(
              env.discord.clientId,
              guild.id,
            ),
            {
              body: commands,
            },
          )
      })

      await Promise.all(requests)
      console.log("Successfully registered application commands.")
    } catch (error) {
      console.error(`[CommandHandler] [registerCommands] ${error}`)
    }
  }


  async optionBuilder(
    options: option[],
    slash: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  ) {
    for (const element of options) {
      switch (element.type) {
        case "string":
          slash.addStringOption((option) => {
            option.setName(element.name).setDescription(element.description)
            if (element.required) option.setRequired(element.required ?? false)
            if (element.choices?.length) {
              option.addChoices(
                ...element.choices.map((e) => ({ name: e, value: e })),
              )
            }

            return option
          })
          break
        case "user":
          slash.addUserOption((option) => {
            option.setName(element.name).setDescription(element.description)
            if (element.required) option.setRequired(element.required ?? false)
            return option
          })
          break
        case "int":
          slash.addIntegerOption((option) => {
            option.setName(element.name).setDescription(element.description)
            if (element.required) option.setRequired(element.required ?? false)
            if (element.min) option.setMinValue(element.min)
            if (element.max) option.setMaxValue(element.max)
            return option
          })
          break
        case "bool":
          slash.addBooleanOption((option) => {
            option.setName(element.name).setDescription(element.description)
            if (element.required) option.setRequired(element.required ?? false)
            return option
          })
          break
        default:
          break
      }
    }
  }
}