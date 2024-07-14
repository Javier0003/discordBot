import { Message, VoiceState } from 'discord.js'

export type EventType = 'messageCreate' | 'voiceStateUpdate' | 'ready'| 'interactionCreate'
export type EventConfiguration = {
  type: EventType
  description?: string
  event?: () => void
  name?: string
}

export type EventCommand = {
  event: ((message: Message) => void) | ((oldState: VoiceState, newState: VoiceState) => void)
}

export default class Event_Builder {
  name = 'event-builder'
  description = 'event builder'
  type = 'messageCreate'

  constructor({
    name = 'command',
    description = 'command',
    type
  }: EventConfiguration) {
    this.name = name
    this.description = description
    this.type = type
  }
}
