import { ApplicationCommandOptionType, CacheType, CommandInteraction } from 'discord.js'
import Command_Builder from '../../structures/command-builder'
import { users } from '../../../drizzle/schemas/schema'
import { db } from '../../utils/db'

export default class OsuRegister extends Command_Builder {
  constructor() {
    super({
      name: 'osu-register',
      description: 'osu!',
      options: [{
        description: 'Pon tu id de osu!',
        name: 'register',
        required: true,
        type: ApplicationCommandOptionType.String
      }],
      notUpdated: true
    })
  }

  public async command(
    interaction: CommandInteraction<CacheType>
  ): Promise<void> {
    try {
      await db.insert(users).values({
        id: interaction.user.id,
        name: interaction.user.globalName,
        osuId: Number(interaction.options.data[0].value)
      })

      interaction.reply({
        content: `Usuario registrado\n${interaction.user.globalName}`,
        ephemeral: true
      })
    } catch (error) {
      interaction.reply({ content: 'ya estas registrado', ephemeral: true })
      console.log(error)
    }
  }
}
