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
import MapasOsu, { OsuRanks } from '../events/daily-map'
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

      const mods = dailyMap.mods.join(' ') || 'nomod'

      this.embed = (await this.embed)
        .setThumbnail(daily.beatmapset.covers.list)
        .setURL(daily.url)
        .setTitle(daily.beatmapset.title)
        .setColor('Random')
        .setDescription(
          `Difficulty: ${daily.difficulty_rating} ★\n${daily.beatmapset.artist} - ${daily.beatmapset.title} [${daily.version}] \n Max Combo: ${daily.max_combo}`
        )
        .addFields(
          { name: 'Mods', value: mods },
          { name: 'Min Rank', value: dailyMap.minRank }
        )

      this.reply = (await this.reply).edit({ embeds: [this.embed] })

      if (userPlay) {
        this.embed = (await this.embed).addFields({
          name: 'Tu ultima jugada',
          value: `Score: ${userPlay.score}\nCombo: ${
            userPlay?.max_combo
          }\nRank: ${userPlay?.rank} \n Accuracy: ${this.accuracy(userPlay.accuracy)}\n Mods: ${userPlay.mods.join(' ')} `
        })

        if (
          (this.validateRank(dailyMap.minRank, userPlay.rank as OsuRanks) &&
            dailyMap.mods.every((mod) => userPlay.mods.includes(mod))) ||
          (this.validateRank(dailyMap.minRank, userPlay.rank as OsuRanks) &&
            dailyMap.mods.length === 0)
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

  private validateRank(requiredRank: OsuRanks, rank: OsuRanks): boolean {
    const ranks: OsuRanks[] = ['D', 'C', 'B', 'A', 'S', 'SS']
    const requiredIndex = ranks.indexOf(requiredRank)
    const rankIndex = ranks.indexOf(rank)
  
    return requiredIndex <= rankIndex
  }

  private accuracy(input: number): string {
    const numberString = input.toString().split('.').pop()

    if (!numberString) return '0'

    const integerPart = numberString.slice(0, 2)
    const decimalPart = numberString.slice(2, 4)

    return `${integerPart},${decimalPart}`
  }
}
