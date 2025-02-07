import { Client, GatewayIntentBits } from 'discord.js'
import env from '../env'
import Event_Handler from './event-handler'
import LoaClient from './loa-client'
import { startServer } from '../web/backend'
export default class LoaBot extends Client {
  clientLoa = new LoaClient(this)

  eventHandler = new Event_Handler()

  api = startServer()

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
