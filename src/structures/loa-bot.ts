import { Client, GatewayIntentBits } from 'discord.js'
import env from '../env'
import Event_Handler from './event-handler'
import LoaClient from './loa-client'
import { startServer } from '../web/backend'
import { OsuClient } from 'osu-loa-wrapper'

export default class LoaBot extends Client {
  public readonly clientLoa = new LoaClient(this)
  public readonly osuClient = new OsuClient(env.osu.clientId, env.osu.apiKey)
  public readonly eventHandler = new Event_Handler()
  public readonly api = startServer()

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
      ]
    })
    this.init()
  }

  private init() {
    this.eventHandler.init()
    this.on('ready', () => {
      console.log('Bot is ready')
    })
    this.login(env.token)
  }
}