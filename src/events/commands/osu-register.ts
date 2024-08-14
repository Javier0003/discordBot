import {
  ApplicationCommandOptionType,
  CacheType,
  CommandInteraction
} from 'discord.js'
import Command_Builder from '../../structures/command-builder'
import { users } from '../../../drizzle/schemas/schema'
import { db } from '../../utils/db'
import getOsuToken from '../../utils/osu-token'

export default class OsuRegister extends Command_Builder {
  constructor() {
    super({
      name: 'osu-register',
      description: 'osu!',
      options: [
        {
          description: 'Pon tu id de osu!',
          name: 'id',
          required: false,
          type: ApplicationCommandOptionType.String
        },
        {
          description: 'Pon tu nombre de osu!',
          type: ApplicationCommandOptionType.String,
          name: 'name',
          required: false
        }
      ],
      notUpdated: true
    })
  }

  public async command(
    interaction: CommandInteraction<CacheType>
  ): Promise<void> {
    try {
      const insertedData = interaction.options.data[0]

      if(!insertedData) throw new Error('No data inserted')
        
      if (insertedData.name === 'id') {
        await db.insert(users).values({
          id: interaction.user.id,
          name: interaction.user.globalName,
          osuId: Number(interaction.options.data[0].value)
        })
      }

      if (insertedData.name === 'name') {
        const token = await getOsuToken()
        const res = await fetch(`https://osu.ppy.sh/api/v2/users/@${insertedData.value}/osu`,{
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'Authorization': `Bearer ${token}`
          }
        })
        const osuName = await res.json() as {username: string, id: string}

        await db.insert(users).values({
          id: interaction.user.id,
          name: osuName.username,
          osuId: Number(osuName.id)
        })
      }

      interaction.reply({
        content: `Usuario registrado\n${interaction.user.globalName}`,
        ephemeral: true
      })
    } catch (error: Error | unknown) {
      if(error instanceof Error && error.message === 'No data inserted') {
        interaction.reply({ content: 'No has insertado ningun dato', ephemeral: true })
      }
      interaction.reply({ content: 'ya estas registrado', ephemeral: true })
      console.log(error)
    }
  }
}
