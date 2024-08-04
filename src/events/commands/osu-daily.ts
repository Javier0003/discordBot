import {
  CacheType,
  CommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  Message
} from 'discord.js'
import Command_Builder from '../../structures/command-builder'
import { users } from '../../../drizzle/schemas/schema'
import { eq } from 'drizzle-orm'
import MapasOsu from '../events/daily-map'
import { db } from '../../utils/db'
import getOsuMap from '../../utils/get-osu-map'
import getOsuRecent from '../../utils/osu-recent'

export default class OsuDaly extends Command_Builder {
  reply: Promise<InteractionResponse<boolean> | Message> | undefined
  embed: EmbedBuilder = new EmbedBuilder()
    .setTitle('osu! Daily map')
    .setDescription('Espera un momento')

  constructor() {
    super({
      name: 'osu-daily',
      description: 'osu!'
    })
  }
  public async command(
    interaction: CommandInteraction<CacheType>
  ): Promise<void> {
    this.reply = interaction.reply({ embeds: [this.embed], ephemeral: false })
    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, interaction.user.id))

      if (user.length === 0) throw new Error('No estas registrado')

      const dailyMap = MapasOsu.dailyMap
      const daily = await getOsuMap(dailyMap.id)
      const userPlays = await getOsuRecent(user[0].osuId)

      const userPlay = userPlays.find(
        (play: any) => play.beatmap.id === dailyMap.id
      )

      this.embed = (await this.embed)
        .setThumbnail(daily.beatmapset.covers.list)
        .setURL(daily.url)
        .setTitle(daily.beatmapset.title)
        .setColor('Random')
        .setDescription(
          `Difficulty: ${daily.difficulty_rating} ★\n${daily.beatmapset.artist} - ${daily.beatmapset.title} [${daily.version}] \n Max Combo: ${daily.max_combo}`
        )
        .addFields(
          { name: 'Mods', value: dailyMap.mods.join(' ') },
          { name: 'Min Rank', value: dailyMap.minRank }
        )

      this.reply = (await this.reply).edit({ embeds: [this.embed] })

      if (userPlay) {
        this.embed = (await this.embed).addFields({
          name: 'Tu ultima jugada',
          value: `Score: ${userPlay.score}\nCombo: ${
            userPlay?.max_combo
          }\nRank: ${userPlay?.rank} \n Mods: ${userPlay.mods.join(' ')}`
        })

        if (
          userPlay.rank === dailyMap.minRank &&
          userPlay.mods.includes(dailyMap.mods[0])
        ) {
          this.embed = (await this.embed).addFields({
            name: 'GG',
            value: 'Has hecho el daily'
          })
          await db
            .update(users)
            // @ts-expect-error this won't ever throw error since this value has a default
            // so it can't be null
            .set({ completados: user[0].completados + 1 })
            .where(eq(users.id, user[0].id))
        }
        this.reply = (await this.reply).edit({ embeds: [this.embed] })
      }
    } catch (error: any) {
      if (error.message === 'No estas registrado') {
        this.reply = (await this.reply).edit({
          content: 'No estas registrado',
          embeds: []
        })
      } else {
        console.log(error)
      }
    }
  }
}
