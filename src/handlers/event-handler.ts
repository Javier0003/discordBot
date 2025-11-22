import Event_Builder, { EventConfiguration, EventType } from '../builders/event-builder'
import { join } from 'node:path'
import { readdirSync } from 'node:fs'
import { ClientEvents, Collection } from 'discord.js'
import LoaSingleton from '../structures/loa-client'

export default class Event_Handler extends LoaSingleton {
  events: Collection<string, { type: EventType; event: Event_Builder<keyof ClientEvents> }>
  constructor() {
    super()
    this.events = new Collection<string, { type: EventType; event: Event_Builder<keyof ClientEvents> }>()
  }

  async init(): Promise<void> {
    this.loadDiscordEvents()
    this.listenEvents()
  }

  private loadDiscordEvents(): void {
    try {
      const path = join(__dirname, '../events/events')
      const events = readdirSync(path)

      for (const event of events) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const Event = require(`${path}/${event}`).default
        const eventInstance: EventConfiguration = new Event(this.loa.repositories)
        if (!eventInstance.event) return
        this.events.set(eventInstance.name!, {
          event: eventInstance as Event_Builder<typeof eventInstance.eventType>,
          type: eventInstance.type as EventType
        })
      }
      console.log(`Loaded ${this.events.size} events`)
    } catch (error) {
      console.log(`Error loading events: ${error}`)
    }
  }

  private listenEvents(): void {
    console.log('Listening to events')
    for (const event of this.events.values()) {
      //@ts-expect-error it's the proper type yet it still errors so it's fine since it
      this.loa[event.type](event.event.eventType, async (...args) => {
        try {
          await event.event.event(...(args as Parameters<typeof event.event.event>))
        } catch (error) {
          console.error(`[EventManager] [${event.event.name}] ${error}`)
        }
      })
    }
  }
}
