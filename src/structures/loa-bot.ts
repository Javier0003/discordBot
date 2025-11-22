import { Client, GatewayIntentBits } from 'discord.js'
import env from '../env'
import LoaSingleton from './loa-client'
import { startServer } from '../api/backend'
import { OsuClient } from 'osu-loa-wrapper'
import CommandHandler from '../handlers/command-handler'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import Event_Handler from '../handlers/event-handler'
import { registerRepositories } from '../repositories/services-registration'

export default class LoaBot extends Client {
  public readonly clientLoa = new LoaSingleton(this)
  public readonly osuClient = new OsuClient(env.osu.clientId, env.osu.apiKey)
  public readonly commandHandler = new CommandHandler()
  public readonly eventHandler = new Event_Handler()
  public readonly api = startServer()
  public readonly db = drizzle(postgres(env.dbUrl));
  public readonly repositories = registerRepositories();

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
    this.login(env.token)
  }
}