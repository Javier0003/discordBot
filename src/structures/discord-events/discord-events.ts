import { ClientEvents } from 'discord.js';
import LoaClient from '../loa-client/loa-client';

export type eventType = 'once' | 'on'

export type discordEventConfiguration = {
  eventName: keyof ClientEvents;
  eventType?: eventType
}

export abstract class DiscordEvent extends LoaClient {
  eventName: keyof ClientEvents;
  eventType?: eventType
  
  constructor({ eventName, eventType }: discordEventConfiguration) {
    super()
    this.eventName = eventName
    this.eventType = eventType || 'on'
  }

  abstract run(...args: any): Promise<void>;
}