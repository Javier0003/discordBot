import {
  CacheType,
  ChatInputCommandInteraction,
  MessageFlags,
} from 'discord.js'
import Command from '../../structures/command-builder'
import { serverUsers, users } from '../../../drizzle/schemas/schema'
import { db } from '../../utils/db'
import getOsuToken from '../../utils/osu-token'
import OptionBuilder from '../../structures/option-builder'

const options = new OptionBuilder()
  .addStringOption({ description: 'Pon tu id de osu!', name: 'id' })
  .addStringOption({ description: 'Pon tu nombre de osu!', name: 'name' })
  .build()

export default class OsuRegister extends Command<typeof options> {

  constructor() {
    super({
      name: 'osu-register',
      description: 'osu!',
      options: options,
      notUpdated: true,
    })
  }

  public async command(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    try {
      this.reply = await interaction.reply({
        content: 'Espera un segundo',
        flags: MessageFlags.Ephemeral
      })

      if (interaction.options.data.length === 0)
        throw new Error('No data inserted')

      const insertedData = interaction.options.data[0]

      if (!insertedData) throw new Error('No data inserted')

      if (insertedData.name === 'id') {
        if(!interaction.user.globalName) return

        await db.insert(users).values({
          id: interaction.user.id,
          name: interaction.user.globalName,
          osuId: Number(interaction.options.data[0].value),
        })
      }

      if (insertedData.name === 'name') {
        const token = await getOsuToken()
        const res = await fetch(
          `https://osu.ppy.sh/api/v2/users/@${insertedData.value}/osu`,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const osuName = (await res.json()) as { username: string; id: string }

        await db.insert(users).values({
          id: interaction.user.id,
          name: osuName.username,
          osuId: Number(osuName.id),
        })

        await db.insert(serverUsers).values({ idServerUser: interaction.user.id })
      }

      this.reply = await this.reply.edit({
        content: `Usuario registrado: ${interaction.user.globalName}`,
      })
    } catch (error: Error | unknown) {
      if (error instanceof Error && error.message === 'No data inserted') {
        if (this.reply) {
          this.reply = await this.reply.edit({
            content: 'No has insertado ningun dato',
          })
        }
      }

      if (this.reply) {
        this.reply = await this.reply.edit({ content: 'ya estas registrado' })
      }
    }
  }
}
