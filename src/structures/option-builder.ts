import { ApplicationCommandOptionType } from "discord.js"

type StringOption = {
  type: ApplicationCommandOptionType.String
  name: string
  description: string
  required?: boolean
  choices?: readonly string[]
}

type BoolOption = {
  type: ApplicationCommandOptionType.Boolean
  name: string
  description: string
  required?: boolean
}

type IntOption = {
  type: ApplicationCommandOptionType.Integer
  name: string
  description: string
  required?: boolean
  min?: number
  max?: number
}

type UserOption = {
  type: ApplicationCommandOptionType.User
  name: string
  description: string
  required?: boolean
}

type option = StringOption | BoolOption | IntOption | UserOption

export default class OptionBuilder<const T extends option[] = []> {
  private options: T = [] as unknown as T

  public addIntOption<const O extends Omit<IntOption, 'type'>>(
    config: O
  ): OptionBuilder{
    this.options.push({ ...config, type: ApplicationCommandOptionType.Integer })

    return this as any
  }

  public addStringOption<const O extends Omit<StringOption, 'type'>>(
    config: O
  ): OptionBuilder {
    this.options.push({ ...config, type: ApplicationCommandOptionType.String })
    return this as any
  }

  public addUserOption<const O extends Omit<UserOption, 'type'>>(
    config: O
  ): OptionBuilder {
    this.options.push({ ...config, type: ApplicationCommandOptionType.User })
    return this as any
  }

  public addBooleanOption<const O extends Omit<BoolOption, 'type'>>(
    config: O
  ): OptionBuilder {
    this.options.push({ ...config, type: ApplicationCommandOptionType.Boolean })
    return this as any
  }

  public build(): T {
    return this.options
  }
}
