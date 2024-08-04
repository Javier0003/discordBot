import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CacheType,
  CommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  Message
} from 'discord.js'
import Command_Builder from '../../structures/command-builder'
import { db } from '../../utils/db'
import { users } from '../../../drizzle/schemas/schema'
import { eq } from 'drizzle-orm'
import { mods, Score } from '../events/daily-map'
import getOsuMap from '../../utils/get-osu-map'
import getOsuRecent from '../../utils/osu-recent'

export default class osuRecent extends Command_Builder {
  reply: Promise<InteractionResponse<boolean> | Message> | undefined
  embed: EmbedBuilder = new EmbedBuilder()
    .setTitle('osu! Recent')
    .setDescription('Espera un momento')

  constructor() {
    super({
      name: 'osu-recent',
      description: 'osu!',
      notUpdated: true
    })
  }
  public async command(
    interaction: CommandInteraction<CacheType>
  ): Promise<void> {
    try {
      this.reply = interaction.reply({ embeds: [this.embed], ephemeral: false })
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, interaction.user.id))

      if (user.length === 0) throw new Error('No estas registrado')

      const userPlays = await getOsuRecent(user[0].osuId)

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

      /*
       * maybe % si no completas el mapa
       */

      await this.editEmbed(userPlays[0])

      this.reply = (await this.reply).edit({
        content: `**Recent osu! Play for ${userPlays[0].user.username}**`,
        //@ts-expect-error idk why this is angry but it works so we don't talk about it
        components: [row]
      })

      let index = 0
      while (true) {
        const userInteraction = await (
          await this.reply
        )
          .awaitMessageComponent({
            time: 30_000
          })
          .catch(async () => {
            await this.removeButtons()
          })

        if (!userInteraction) break

        if (userInteraction.customId === 'exit') await this.removeButtons()
        if (userInteraction.customId === '-1' && index > 0) index--
        if (userInteraction.customId === '1' && index < userPlays.length - 1)
          index++

        await userInteraction.deferUpdate()

        await this.editEmbed(userPlays[index])
      }
      
    } catch (error: any) {
      if(error.message === 'No estas registrado') {
        this.reply = interaction.reply({
          content: error.message,
          ephemeral: true
        })
        return
      }
      console.log(error)
    }
  }

  private async removeButtons(): Promise<void> {
    this.reply = (await this.reply)?.edit({
      components: []
    })
  }

  private accuracy(input: number): string {
    const numberString = input.toString().split('.').pop()

    if (!numberString) return '0'

    const integerPart = numberString.slice(0, 2)
    const decimalPart = numberString.slice(2, 4)

    return `${integerPart},${decimalPart}`
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

  private async editEmbed(score: Score): Promise<void> {
    const mapInfo = await getOsuMap(score.beatmap.id)

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
        )}PP **${this.accuracy(score.accuracy)}% Accuracy\n${this.mods(
          score.mods
        )}`
      )
      .setFooter({ text: 'osu!' })
      .setTimestamp()

    this.reply = (await this.reply)?.edit({
      embeds: [this.embed]
    })
  }
}
