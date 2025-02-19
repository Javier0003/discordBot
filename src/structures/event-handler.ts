import LoaClient from './loa-client'
import { EventConfiguration } from './event-builder'
import { join } from 'node:path'
import { readdirSync } from 'node:fs'

export default class Event_Handler extends LoaClient {
  constructor() {
    super()
  }

  public init() {
   this.loadDiscordEvents()
  }

  private loadDiscordEvents(): void {
    try {
      const path = join(__dirname, '../events/events')
      const events = readdirSync(path)
      for (const event of events) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const Event = require(`${path}/${event}`).default
        const eventInstance: EventConfiguration = new Event()
        if (!eventInstance.event) return
        //@ts-expect-error idk bro
        this.loa[eventInstance.type](eventInstance.eventType,eventInstance.event)
      }
      
    } catch (error) {
      console.log(`Error loading events: ${error}`)
    }
  }
}
