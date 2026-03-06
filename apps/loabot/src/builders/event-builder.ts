import { Client, ClientEvents } from 'discord.js'
import LoaSingleton from '../structures/loa-client'

export type EventType = keyof ClientEvents
export type EventConfiguration = {
  description?: string
  event?: () => void
  name?: string
  eventType: EventType
  type?: keyof Client
}

export default abstract class Event_Builder<Event extends keyof ClientEvents> extends LoaSingleton{
  public name = 'event-builder'
  public description = 'event builder'
  public eventType: Event
  public type: keyof Client

  constructor({
    name = 'command',
    description = 'command',
    eventType,
    type = 'on'
  }: Omit<EventConfiguration & {eventType: Event}, 'event'>) {
    super()
    this.name = name
    this.description = description
    this.eventType = eventType
    this.type = type

  }

  abstract event(...args: ClientEvents[Event]): void
}
