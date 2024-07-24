import { APIApplicationCommandOption, ApplicationCommandOptionType, CacheType, CommandInteraction } from 'discord.js'
import LoaClient from './loa-client'

export type CommandConfig = {
  name: string
  description: string
  devOnly?: boolean
  testOnly?: boolean
  options?: APIApplicationCommandOption[]
  deleted?: boolean
  notUpdated?: boolean
}

export default abstract class Command_Builder extends LoaClient implements CommandConfig {
  readonly name
  readonly description
  readonly devOnly
  readonly testOnly
  readonly options
  readonly deleted
  readonly notUpdated
  constructor({
    name,
    description,
    devOnly,
    testOnly,
    options,
    deleted,
    notUpdated
  }: CommandConfig) {
    super()
    this.name = name
    this.description = description
    this.devOnly = devOnly
    this.testOnly = testOnly
    this.options = options
    this.deleted = deleted
    this.notUpdated = notUpdated
  }
  public abstract command(interaction: CommandInteraction<CacheType>): Promise<void>
}
