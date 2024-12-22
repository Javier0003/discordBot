import {
  ActionRowBuilder,
  ButtonBuilder,
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
  Plays,
  plays,
  Users,
  users
} from '../../../drizzle/schemas/schema'
import { desc, eq } from 'drizzle-orm'
import getOsuMap from '../../utils/get-osu-map'
import getOsuToken from '../../utils/osu-token'
import OsuDaily from './osu-daily'

type playStats = {
  plays: Plays
  users: Users
}

type MapList = {
  month: string
  maps: Mapas[]
}

export default class MapStats extends Command_Builder {
  private reply: InteractionResponse<boolean> | Message | undefined
  private embed: EmbedBuilder = new EmbedBuilder()
    .setTitle('Map Stats')
    .setDescription('Elige el mapa que quieres ver')

  private token: string = ''

  constructor() {
    super({
      name: 'map-stats',
      description: 'Muestra las estadisticas de un mapa',
      options: [],
      // notUpdated: true
    })
  }

  public async command(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    try {
      this.reply = await interaction.reply('Espera un momento')
      // this.token = await getOsuToken()
      const maps = await db.select().from(mapas)
      const mapData = this.transformMapData(maps)

      console.log(mapData)
      const buttons: ButtonBuilder[] = []

      mapData.forEach((map) => {
        buttons.push(
          new ButtonBuilder()
          .setLabel(map.month)
          .setStyle(ButtonStyle.Primary)
          .setCustomId(`${map.month}`)
        )
      })

      const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        ...buttons
      )

      this.reply = await this.reply.edit({
        content: 'Elige el mes que quieres ver',
        components: [actionRow]
      })

      // mapData[0].maps.forEach((map) => {
      //   buttons.push(
      //     new ButtonBuilder()
      //     .setLabel(map.mapName)
      //     .setStyle(ButtonStyle.Primary)
      //     .setCustomId(`${map.oldMaps}`)
      //   )
      // })

      // const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      //   ...buttons
      // )

      // this.reply = await this.reply.edit({
      //   content: 'Elige el mapa que quieres ver',
      //   components: [actionRow]
      // })

      // const collector = this.reply.createMessageComponentCollector({
      //   componentType: ComponentType.Button,
      //   time: 60_000,
      //   filter: (i) => i.user.id === interaction.user.id
      // })

      // collector.on('collect', async (i) => {
      //   await i.deferUpdate()
      //   console.log(i.customId)

      //   this.reply = await this.reply?.edit({
      //     content: 'Espera un momento'
      //   })
      // })

    } catch (error) {
      console.log(error)
    }
  }

  private transformMapData(inputData: Mapas[]): MapList[] {
    const groupedData = new Map();
    inputData.forEach(item => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [day, month, year] = item.date.split('/').map(Number);
      
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthYear = `${monthNames[month - 1]} ${year}`;
  
      if (!groupedData.has(monthYear)) {
        groupedData.set(monthYear, { 
          month: monthYear, 
          maps: [] 
        });
      }
  
      const monthData = groupedData.get(monthYear);
      monthData.maps.push(item);
    });
  
    return Array.from(groupedData.values());
  }
}