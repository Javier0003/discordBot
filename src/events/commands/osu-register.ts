import {
  CacheType,
  CommandInteraction
} from 'discord.js'
import Command_Builder from '../../structures/command-builder'
import DbConnection from '../../structures/db-connection'

export default class OsuRegister extends Command_Builder {
  constructor() {
    super({
      name: 'osu-register',
      description: 'osu!'
    })
  }

  public async command(
    interaction: CommandInteraction<CacheType>
  ): Promise<void> {
    try {
      const db = DbConnection.db
      await db.user.create({
        data: {
          id: interaction.user.id,
          nombre: interaction.user.globalName!,
          completados: 0
        }
      })
      interaction.reply({ content: `Usuario registrado\n${interaction.user.globalName}`, ephemeral: true })
    } catch (error) {
      interaction.reply({ content: 'ya estas registrado', ephemeral: true })
      console.log(error)
    }
  }
}
