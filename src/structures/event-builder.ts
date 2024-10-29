import { ClientEvents } from 'discord.js'

export type EventType = keyof ClientEvents
export type EventConfiguration = {
  description?: string
  event?: () => void
  name?: string
}

export default abstract class Event_Builder<Event extends keyof ClientEvents> {
  name = 'event-builder'
  description = 'event builder'
  eventType: Event

  constructor({
    name = 'command',
    description = 'command',
    type
  }: EventConfiguration & {type: Event}) {
    this.name = name
    this.description = description
    this.eventType = type
  }
  abstract event(...args: ClientEvents[Event]): void
}
