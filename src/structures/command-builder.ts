import { APIApplicationCommandOption, CacheType, ChatInputCommandInteraction } from 'discord.js'
import LoaClient from './loa-client'

export type CommandConfiguration = {
  name: string
  description: string
  devOnly?: boolean
  testOnly?: boolean
  options?: APIApplicationCommandOption[]
  deleted?: boolean
  notUpdated?: boolean
}

export interface CommandConfig extends CommandConfiguration {
  command?: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>
  execute?: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>
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
  public abstract command(interaction: ChatInputCommandInteraction<CacheType>): Promise<void>

  public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
    this.command(interaction)
  }
}
