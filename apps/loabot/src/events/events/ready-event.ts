import Event_Builder from '../../builders/event-builder'

export default class ReadyEvent extends Event_Builder<'ready'> {
  constructor() {
    super({
      name: 'ready',
      description: 'ready event',
      eventType: 'ready',
      type: 'once'
    })
  }

  async event(): Promise<void> {
    console.log('Bot is ready')
    console.log('Loading commands...')
    await this.loa.commandHandler.loadCommands()
    console.log('Registering commands...')
    this.loa.commandHandler.registerCommands()
  }
}