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
import osuConfig, {
  DailyMap,
  OsuRanks,
  Score
} from '../../utils/osu-daily.config'
import getOsuToken from '../../utils/osu-token'

export default class OsuDaly extends Command_Builder {
  reply: Promise<InteractionResponse<boolean> | Message> | undefined
  embed: EmbedBuilder = new EmbedBuilder()
    .setTitle('osu! Daily map')
    .setDescription('Espera un momento')

  constructor() {
    super({
      name: 'osu-daily',
      description: 'osu!',
      notUpdated: true
    })
  }
  public async command(
    interaction: CommandInteraction<CacheType>
  ): Promise<void> {
    this.reply = interaction.reply({ embeds: [this.embed], ephemeral: false })
    try {
      const token = await getOsuToken()

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, interaction.user.id))

      if (user.length === 0) throw new Error('No estas registrado')

      const dailyMap = MapasOsu.dailyMap
      const daily = await getOsuMap(dailyMap.id, token)
      const userPlays = await getOsuRecent(user[0].osuId, token)

      const userPlay = userPlays.find(
        (play: { beatmap: { id: number } }) => play.beatmap.id === dailyMap.id
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
          }\nRank: ${userPlay?.rank} \n Accuracy: ${this.accuracy(
            userPlay.accuracy
          )}\n Mods: ${userPlay.mods.join(' ')} `
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
          MapasOsu.addPlay({
            mapId: dailyMap.id,
            uid: user[0].id,
            rank: userPlay.rank as OsuRanks,
            score: userPlay.score,
            accuracy: userPlay.accuracy,
            points: this.getPoints(userPlay, dailyMap)
          })
        }
        this.reply = (await this.reply).edit({ embeds: [this.embed] })
      }
    } catch (error: Error | unknown) {
      if (error instanceof Error && error.message === 'No estas registrado') {
        this.reply = (await this.reply).edit({
          content: 'No estas registrado',
          embeds: []
        })
      } else {
        console.log(error)
      }
    }
  }

  private getPoints(rank: Score, requiredRank: DailyMap): number {
    let score = osuConfig.points.completePoints

    if (!rank.mods.includes('NF') && requiredRank.mods.includes('NF'))
      score += osuConfig.points.noNFwhenNF
    if (rank.mods.includes('FL')) score += osuConfig.points.FLPlay

    if (rank.rank === requiredRank.minRank) return score

    const rankIndex = osuConfig.ranks.indexOf(rank.rank)
    const requiredIndex = osuConfig.ranks.indexOf(requiredRank.minRank)
    score += (rankIndex - requiredIndex) * osuConfig.points.multiplierForBetterRankThanAsked

    return score
  }

  public validateRank(requiredRank: OsuRanks, rank: OsuRanks): boolean {
    const requiredIndex = osuConfig.ranks.indexOf(requiredRank)
    const rankIndex = osuConfig.ranks.indexOf(rank)

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
