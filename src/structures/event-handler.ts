import { readdir } from 'node:fs/promises'
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
        const Event = require(`${path}/${event}`).default
        const eventInstance: EventConfiguration = new Event()
        if (!eventInstance.event) return
        this.loa['on'](eventInstance.type,eventInstance.event)
      }
    } catch (error) {
      console.log(`Error loading events: ${error}`)
    }
  }
}
