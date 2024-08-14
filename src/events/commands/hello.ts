import { CacheType, CommandInteraction } from 'discord.js'
import Command_Builder from '../../structures/command-builder'
// import { db } from '../../utils/db'
// import { mapas } from '../../../drizzle/schemas/schema'
// import { eq } from 'drizzle-orm'

export default class Hello extends Command_Builder {
  constructor() {
    super({
      name: 'hello',
      description: 'Hello',
      devOnly: false,
      testOnly: false,
      options: [],
      deleted: false,
      notUpdated: true
    })
  }
  public async command(interaction: CommandInteraction<CacheType>) {
    interaction.reply('hello')
    // const xd = ['D', 'C', 'B', 'A', 'S', 'SS']


    // console.log(await db.select().from(mapas))

    // xd.forEach(async (rank) => {
    //   await db.delete(mapas).where(eq(mapas.oldMapMinRank, rank))
    // })

    // console.log(await db.select().from(mapas))
  }
}
