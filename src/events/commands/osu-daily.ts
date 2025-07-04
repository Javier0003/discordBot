import {
  CacheType,
  ChatInputCommandInteraction,
} from 'discord.js'
import Command from '../../structures/command-builder'
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

export default class OsuDaily extends Command {
  constructor() {
    super({
      name: 'osu-daily',
      description: 'osu!',
      notUpdated: true
    })
  }
  public async command(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    this.embed.setTitle('osu! Daily map').setDescription('Espera un momento')

    this.reply = interaction.reply({ embeds: [this.embed] })
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
          }\nRank: ${userPlay?.rank} \n Accuracy: ${OsuDaily.accuracy(
            userPlay.accuracy
          )}\n Mods: ${userPlay.mods.join(' ')} `
        })

        if (
          (this.validateRank(dailyMap.minRank, userPlay.rank) &&
            OsuDaily.validateMods(dailyMap, userPlay)) ||
          (this.validateRank(dailyMap.minRank, userPlay.rank) &&
            dailyMap.mods.length === 0)
        ) {
          const scoredPoints = this.getPoints(userPlay, dailyMap)
          this.embed = (await this.embed).addFields({
            name: 'GG',
            value: `Has hecho el daily \nHas ganado ${scoredPoints} puntos`
          })
          await MapasOsu.addPlay({
            mapId: dailyMap.id,
            uid: user[0].id,
            rank: userPlay.rank,
            score: userPlay.score,
            accuracy: userPlay.accuracy,
            points: scoredPoints,
            pp: Math.ceil(userPlay.pp || 0),
            combo: userPlay.max_combo
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

  public static validateMods(dailyMap: DailyMap, userPlay: Score) {
    const modBan = osuConfig.modBansWhenNotAskedFor

    if (
      modBan.some(
        (mod) => !dailyMap.mods.includes(mod) && userPlay.mods.includes(mod)
      )
    ) {
      return false
    }

    if (dailyMap.mods.every((mod) => userPlay.mods.includes(mod))) {
      return true
    }
  }

  private getPoints(rank: Score, requiredRank: DailyMap): number {
    let score = osuConfig.points.completePoints
    let rankFixer = '' as OsuRanks

    switch (rank.rank) {
      case 'SH':
        rankFixer = 'S'
        break
      case 'SSH':
        rankFixer = 'SS'
        break
      default:
        rankFixer = rank.rank
        break
    }

    if (!rank.mods.includes('NF') && requiredRank.mods.includes('NF'))
      score += osuConfig.points.noNFwhenNF
    if (rank.mods.includes('FL')) score += osuConfig.points.FLPlay

    if (rankFixer === requiredRank.minRank) return score

    const rankIndex = osuConfig.ranks.indexOf(rankFixer)
    const requiredIndex = osuConfig.ranks.indexOf(requiredRank.minRank)
    score +=
      (rankIndex - requiredIndex) *
      osuConfig.points.multiplierForBetterRankThanAsked

    return score
  }

  public validateRank(requiredRank: OsuRanks, rank: OsuRanks): boolean {
    const requiredIndex = osuConfig.ranks.indexOf(requiredRank)
    const rankIndex = osuConfig.ranks.indexOf(rank)

    return requiredIndex <= rankIndex
  }

  public static accuracy(input: number): string {
    if(input === 1) return '100'
    const numberString = input.toString().split('.').pop()

    if (!numberString) return '0'

    const integerPart = numberString.slice(0, 2)
    const decimalPart = numberString.slice(2, 4)

    return `${integerPart},${decimalPart}`
  }
}
