import { APIApplicationCommandOption, ApplicationCommandOptionType } from 'discord.js'
import LoaClient from '../loa-client/loa-client'

export type CommandConfig = {
  name: string
  description: string
  devOnly?: boolean
  testOnly?: boolean
  options?: APIApplicationCommandOption[]
  deleted?: boolean
}

export default class Command_Builder extends LoaClient implements CommandConfig {
  readonly name
  readonly description
  readonly devOnly
  readonly testOnly
  readonly options
  readonly deleted
  constructor({
    name,
    description,
    devOnly,
    testOnly,
    options,
    deleted,
  }: CommandConfig) {
    super()
    this.name = name
    this.description = description
    this.devOnly = devOnly
    this.testOnly = testOnly
    this.options = options
    this.deleted = deleted
  }
}
