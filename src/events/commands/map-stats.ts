import {
  ActionRowBuilder,
  CacheType,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  InteractionResponse,
  Message,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} from 'discord.js'
import Command_Builder from '../../structures/command-builder'
import { db } from '../../utils/db'
import {
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
      options: []
    })
  }

  public async command(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    try {
      this.token = await getOsuToken()
      const maps = await db.select().from(mapas)

      const select = new StringSelectMenuBuilder()
        .setCustomId('map-stats')
        .setPlaceholder('Selecciona un mapa')
        .addOptions(
          maps.map((map) =>
            new StringSelectMenuOptionBuilder()
              .setLabel(`${map.mapName} - ${map.date}`)
              .setValue(`${map.oldMaps}`)
          )
        )

      const row = new ActionRowBuilder().addComponents(select)

      this.reply = await interaction.reply({
        embeds: [this.embed],
        //@ts-expect-error same error as always with discord.js
        components: [row]
      })

      const collector = this.reply.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 60_000,
        filter: (i) => i.user.id === interaction.user.id
      })

      collector.on('collect', async (i) => {
        await i.deferUpdate()
        const mapId = Number(i.values[0])

        const stats = (await db
          .select()
          .from(plays)
          .where(eq(plays.mapId, mapId))
          .orderBy(desc(plays.puntos))
          .leftJoin(users, eq(plays.uId, users.id))) as unknown as playStats[]

        await this.updateEmbed(mapId, stats)
      })
    } catch (error) {
      console.log(error)
    }
  }

  private async updateEmbed(mapId: number, stats: playStats[]): Promise<void> {
    try {
      const mapData = await getOsuMap(mapId, this.token)
      const fields = stats.map((stat, index) => ({
        name: `#${index + 1}`,
        value: `${stat.users.name}:\nPuntos:${stat.plays.puntos}\nRank: ${
          stat.plays.rank
        }\nScore: ${stat.plays.score}\nAccuracy: ${OsuDaily.accuracy(
          Number(stat.plays.accuracy)
        )}%`
      }))

      this.embed = this.embed.setFields([])

      this.embed = this.embed
        .setDescription(
          `[${mapData.beatmapset.title}](${mapData.url}) - ${mapData.version} - ${mapData.difficulty_rating}★ \n`
        )
        .setThumbnail(mapData.beatmapset.covers.list)
        .addFields(fields)

      this.reply = await this.reply?.edit({
        embeds: [this.embed]
      })
    } catch (error) {
      console.log(error)
    }
  }
}
