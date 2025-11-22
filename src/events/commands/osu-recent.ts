import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CacheType,
  ChatInputCommandInteraction,
} from 'discord.js'
import Command from '../../builders/command-builder'
import { users } from '../../../drizzle/schemas/schema'
import { eq } from 'drizzle-orm'
import getOsuMap from '../../utils/get-osu-map'
import getOsuRecent from '../../utils/osu-recent'
import osuConfig, { mods, Score } from '../../utils/osu-daily.config'
import getOsuToken from '../../utils/osu-token'
import OsuDaily from './osu-daily'
import { RepositoryObj } from '../../repositories/services-registration'

export default class osuRecent extends Command {
  private readonly userRepository: RepositoryObj['userRepository']
  
  constructor({userRepository}: RepositoryObj) {
    super({
      name: 'osu-recent',
      description: 'osu!',
      notUpdated: true
    })

    this.userRepository = userRepository
  }
  public async command(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    try {
      const token = await getOsuToken()
      this.embed = this.embed.setTitle('osu! Recent').setDescription('Espera un momento')
      this.reply = await interaction.reply({ embeds: [this.embed] })
      const user = await this.userRepository.getById(interaction.user.id)

      if (!user) throw new Error('No estas registrado')

      const userPlays = await getOsuRecent(user.osuId, token)

      if (userPlays.length === 0) {
        this.reply = await this.reply.edit({
          content: 'No tienes plays recientes',
          embeds: []
        })
        return
      }

      const buttons = [
        new ButtonBuilder()
          .setCustomId('-1')
          .setLabel('<')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('exit')
          .setLabel('exit')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('1')
          .setLabel('>')
          .setStyle(ButtonStyle.Secondary)
      ]

      const row = new ActionRowBuilder().addComponents(buttons)

      /** 
       * maybe % si no completas el mapa
       */

      await this.editEmbed(userPlays[0], token)

      this.reply = await this.reply.edit({
        content: `**Recent osu! Play for ${userPlays[0].user.username}**`,
        //@ts-expect-error idk why this is angry but it works so we don't talk about it
        components: [row]
      })

      let index = 0
      let loop = true
      while (loop) {
        const userInteraction = await 
          this.reply
          .awaitMessageComponent({
            time: osuConfig.recentWaitForInteractionTime
          })
          .catch(async () => {
            await this.removeButtons()
            loop = false
          })

        if (!userInteraction) break

        if (userInteraction.customId === 'exit') await this.removeButtons()
        if (userInteraction.customId === '-1' && index > 0) index--
        if (userInteraction.customId === '1' && index < userPlays.length - 1)
          index++

        await userInteraction.deferUpdate()

        await this.editEmbed(userPlays[index], token)
      }
      
    } catch (error: Error | unknown) {
      if(error instanceof Error && error.message === 'No estas registrado') {
        this.reply = await this.reply?.edit({
          content: error.message,
        })
        return
      }
      this.reply = await this.reply?.edit({
        content: 'No tienes plays recientes',
      })
    }
  }

  private async removeButtons(): Promise<void> {
    this.reply = await this.reply?.edit({
      components: []
    })
  }

  private mods(input: mods[]): string {
    if (input.length === 0) return 'No mods'
    let modString = 'Mods: ['

    for (let i = 0; i < input.length; i++) {
      modString += `${input[i]}`
      if (i !== input.length - 1) modString += ', '
    }

    modString += ']'

    return modString
  }

  private async editEmbed(score: Score, token: string): Promise<void> {
    const mapInfo = await getOsuMap(score.beatmap.id, token)

    this.embed = (await this.embed)
      .setTitle(
        `${score.beatmapset.title}-[${score.beatmap.version}]-[${score.beatmap.difficulty_rating}★]`
      )
      .setURL(score.beatmap.url)
      .setColor('Random')
      .setFields([
        { name: 'Score', value: score.score.toLocaleString() },
        {
          name: 'Combo',
          value: `[x${score.max_combo}/${mapInfo.max_combo}] [${
            (score.statistics.count_300 ?? 0) +
            (score.statistics.count_geki ?? 0)
          }/${
            (score.statistics.count_100 ?? 0) +
            (score.statistics.count_katu ?? 0)
          }/${score.statistics.count_50 ?? 0}/${
            score.statistics.count_miss ?? 0
          }]`
        }
      ])
      .setThumbnail(score.beatmapset.covers.list)
      .setDescription(
        `▸ **'${score.rank}' RANK**\n▸ ** ${Math.ceil(
          score.pp || 0
        )}PP **${OsuDaily.accuracy(score.accuracy)}% Accuracy\n${this.mods(
          score.mods
        )}`
      )
      .setFooter({ text: 'osu!' })
      .setTimestamp()

    this.reply = await this.reply?.edit({
      embeds: [this.embed]
    })
  }
}
