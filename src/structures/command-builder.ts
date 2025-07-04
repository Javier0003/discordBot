/* eslint-disable @typescript-eslint/no-explicit-any */
import { CacheType, ChatInputCommandInteraction, Collection, EmbedBuilder, InteractionResponse, Message, User } from 'discord.js'
import LoaClient from './loa-client'
import { option } from './option-builder'

type TypeMap = {
  string: string
  user: User
  boolean: boolean
  int: number
}

type OptionToValue<O extends readonly option[]> = {
  [K in O[number]as K['name']]: K extends { type: keyof TypeMap }
  ? TypeMap[K['type']]
  : unknown
}

export type CommandConfiguration<O extends option[] | undefined = undefined> =
  O extends undefined
  ? {
    name: string
    description: string
    devOnly?: boolean
    testOnly?: boolean
    deleted?: boolean
    notUpdated?: boolean
  }
  : {
    name: string
    description: string
    devOnly?: boolean
    testOnly?: boolean
    options: O
    deleted?: boolean
    notUpdated?: boolean
  }

export default abstract class Command<
  O extends option[] | undefined = undefined,
> extends LoaClient {
  protected reply: Promise<InteractionResponse<boolean> | Message> | undefined
  protected embed: EmbedBuilder = new EmbedBuilder();
  readonly name
  readonly description
  readonly devOnly
  readonly testOnly
  readonly _optionList: O | null = null
  readonly deleted
  readonly notUpdated
  private optionsList: O extends readonly option[]
    ? Collection<keyof OptionToValue<O> & string, OptionToValue<O>[keyof OptionToValue<O> & string]>
    : Collection<string, { data: string | User | boolean | number }> =
    new Collection() as any;

  protected getOption<K extends keyof (O extends readonly option[] ? OptionToValue<O> : Record<string, any>) & string>(
    key: K
  ): (O extends readonly option[] ? OptionToValue<O> : Record<string, any>)[K] {
    return this.optionsList.get(key) as any
  }

  get options() {
    return this.optionsList
  }

  constructor(readonly configs: CommandConfiguration<O>) {
    super()
    this.name = configs.name
    this.description = configs.description
    this.devOnly = configs.devOnly
    this.testOnly = configs.testOnly
    //@ts-expect-error ts cryin 😔
    this._optionList = configs.options
    this.deleted = configs.deleted
    this.notUpdated = configs.notUpdated
  }
  public abstract command(interaction: ChatInputCommandInteraction<CacheType>): Promise<void>

  public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
    this.fetchOptions(interaction)
    this.command(interaction)

    this.embed = new EmbedBuilder();
    this.reply = undefined;
  }

  private fetchOptions(interaction: ChatInputCommandInteraction<CacheType>): void {
    if (!this._optionList) return
    this._optionList.forEach((option) => {
      switch (option.type) {
        
        case 'string':
          this.optionsList.set(option.name as O extends readonly option[] ? O[number]['name'] : string, {
            data: interaction.options.getString(option.name, option.required ?? false) as string,
          })
          break
        case 'user':
          this.optionsList.set(option.name as O extends readonly option[] ? O[number]['name'] : string, {
            data: interaction.options.getUser(option.name, option.required ?? false) as User,
          })
          break
        case 'bool':
          this.optionsList.set(option.name as O extends readonly option[] ? O[number]['name'] : string, {
            data: interaction.options.getBoolean(option.name, option.required ?? false) as boolean,
          })
          break
        case 'int':
          this.optionsList.set(option.name as O extends readonly option[] ? O[number]['name'] : string, {
            data: interaction.options.getInteger(option.name, option.required ?? false) as number,
          })
          break
        default:
          break
      }
    })
  }
}