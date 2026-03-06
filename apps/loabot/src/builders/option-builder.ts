type StringOption = {
  type: 'string'
  name: string
  description: string
  required?: boolean
  choices?: readonly string[]
}

type BoolOption = {
  type: 'bool'
  name: string
  description: string
  required?: boolean
}

type IntOption = {
  type: 'int'
  name: string
  description: string
  required?: boolean
  min?: number
  max?: number
}

type UserOption = {
  type: 'user'
  name: string
  description: string
  required?: boolean
}

type Expand<T> = T extends infer O ? { readonly [K in keyof O]: O[K] } : never;

export type option = StringOption | BoolOption | IntOption | UserOption

export default class OptionBuilder<const T extends option[] = []> {
  private options: T = [] as unknown as T

  public addIntOption<const O extends Omit<IntOption, 'type'>>(
    config: O
  ): OptionBuilder <[...T, Expand<O & { type: "int" }>]>{
    this.options.push({ ...config, type: 'int' })

    return this as any
  }

  public addStringOption<const O extends Omit<StringOption, 'type'>>(
    config: O
  ): OptionBuilder<[...T, Expand<O & { type: "string" }>]> {
    this.options.push({ ...config, type: 'string' })
    return this as any
  }

  public addUserOption<const O extends Omit<UserOption, 'type'>>(
    config: O
  ): OptionBuilder<[...T, Expand<O & { type: "user" }>]> {
    this.options.push({ ...config, type: 'user' })
    return this as any
  }

  public addBooleanOption<const O extends Omit<BoolOption, 'type'>>(
    config: O
  ): OptionBuilder<[...T, Expand<O & { type: "bool" }>]> {
    this.options.push({ ...config, type: 'bool' })
    return this as any
  }

  public build(): T {
    return this.options
  }
}
