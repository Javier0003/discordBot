import { readdir } from 'node:fs/promises'
import LoaClient from '../loa-client/loa-client'
import { EventConfiguration } from '../event-builder/event-builder'

export default class Event_Handler extends LoaClient {
  constructor() {
    super()
  }

  public async init() {
    await this.loadDiscordEvents()
  }

  private async loadDiscordEvents(): Promise<void> {
    try {
      const events = await readdir('./src/events/events')
      for (const event of events) {
        const { default: Event } = await import(`../../events/events/${event}`)
        const eventInstance: EventConfiguration = new Event()
        if (!eventInstance.event) return
        this.loa['on'](eventInstance.type,eventInstance.event)
      }
    } catch (error) {
      console.log(`Error loading events: ${error}`)
    }
  }
}
