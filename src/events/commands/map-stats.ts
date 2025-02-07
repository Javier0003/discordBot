import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  InteractionResponse,
  Message,
} from 'discord.js'
import Command_Builder from '../../structures/command-builder'
import { db } from '../../utils/db'
import {
  Mapas,
  mapas,
  plays,
} from '../../../drizzle/schemas/schema'
import { desc, eq } from 'drizzle-orm'
import getOsuMap from '../../utils/get-osu-map'
import getOsuToken from '../../utils/osu-token'

type MapList = {
  month: string
  maps: Mapas[]
}

export default class MapStats extends Command_Builder {
  private reply: InteractionResponse<boolean> | Message | undefined
  private embed: EmbedBuilder = new EmbedBuilder()
    .setTitle('Map Stats')

  private token: string = ''

  constructor() {
    super({
      name: 'map-stats',
      description: 'Muestra las estadisticas de un mapa',
      options: [],
      notUpdated: true
    })
  }

  public async command(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    try {
      this.reply = await interaction.reply('Espera un momento')
      const maps = await db.select().from(mapas)
      const mapData = this.transformMapData(maps)

      const buttons: ButtonBuilder[] = []

      for (let i = 0; i < 5; i++) {
        buttons.push(
          new ButtonBuilder()
            .setLabel(`xd${i}`)
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`xd2${i}`)
        )
      }

      // mapData.forEach((map) => {
      //   buttons.push(
      //     new ButtonBuilder()
      //       .setLabel(map.month)
      //       .setStyle(ButtonStyle.Primary)
      //       .setCustomId(`${map.month}`)
      //   )
      // })

      const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        ...buttons
      )

      this.reply = await this.reply.edit({
        content: 'Elige el mes que quieres ver',
        components: [actionRow],
      })

      const collector = this.reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 60_000,
        filter: (i) => i.user.id === interaction.user.id
      })

      collector.on('collect', async (i) => {
        try {
          await i.deferUpdate()
          const map = i.customId.split(' ')

          if (map[0] === 'map') {
            this.map(map[1])
            return
          }

          this.months(mapData, i)
        } catch (error) {
          console.log(error)
        }
      })

    } catch (error) {
      console.log(error)
    }
  }

  private async map(mapId: string) {
    try {
      this.reply = await this.reply?.edit({
        content: 'Espera un momento'
      })

      this.token = await getOsuToken()
      const mapData = await getOsuMap(Number(mapId), this.token)



      this.embed.setTitle(`Plays for: ${mapData.beatmapset.title}[${mapData.version}]`).setURL(mapData.url)

      const playList = await db.select().from(plays).where(
        eq(plays.mapId, Number(mapId))
      ).orderBy(desc(plays.score))

      playList.forEach((play) => {
        this.embed.addFields(
          { value: `**${play.score}**`, name: `${play.uId}`, inline: true },
        )
      })

      this.reply = await this.reply?.edit({
        content: `**Plays for: ${mapData.beatmapset.title}[${mapData.version}]**`,
        components: [],
        embeds: [this.embed]
      })
    } catch (error) {
      console.log(`Error eligiendo mapa: ${error}`)
    }
  }

  private async months(mapData: MapList[], i: ButtonInteraction<CacheType>) {
    try {
      const monthData = mapData.find((data) => data.month === i.customId)

      this.reply = await this.reply?.edit({
        content: 'Espera un momento'
      })

      const buttons: ButtonBuilder[] = []

      monthData?.maps.forEach((map) => {
        buttons.push(
          new ButtonBuilder()
            .setLabel(map.mapName)
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`map ${map.oldMaps}`)
        )
      })

      const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        ...buttons
      )

      this.reply = await this.reply?.edit({
        content: 'Elige el mapa que quieres ver',
        components: [actionRow],
      })
    } catch (error) {
      console.log(`Error eligiendo mes: ${error}`)
    }
  }

  private transformMapData(inputData: Mapas[]): MapList[] {
    const groupedData = new Map()
    inputData.forEach(item => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [day, month, year] = item.date.split('/').map(Number)

      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ]
      const monthYear = `${monthNames[month - 1]} ${year}`

      if (!groupedData.has(monthYear)) {
        groupedData.set(monthYear, {
          month: monthYear,
          maps: []
        })
      }

      const monthData = groupedData.get(monthYear)
      monthData.maps.push(item)
    })

    return Array.from(groupedData.values())
  }
}