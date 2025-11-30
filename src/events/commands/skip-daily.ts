import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CacheType,
  ChatInputCommandInteraction,
} from 'discord.js'
import Command from '../../builders/command-builder'
import MapasOsu from '../events/daily-map'
import { RepositoryObj } from '../../repositories/services-registration'

export default class skipDaily extends Command {
  private readonly mapasRepository: RepositoryObj['mapasRepository']
  constructor({ mapasRepository }: RepositoryObj) {
    super({
      name: 'skip-daily',
      description: 'Skip the daily',
      devOnly: true,
      testOnly: false,
      deleted: false,
      notUpdated: true,
    })
    this.mapasRepository = mapasRepository
  }

  async command(reply: ChatInputCommandInteraction<CacheType>) {
    this.embed = this.embed.setTitle('Skipping daily map')
      .setColor('Red')
      .setDescription('Confirm?')
    try {
      const buttons = [
        new ButtonBuilder()
          .setCustomId('true')
          .setLabel('Yes')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('false')
          .setLabel('No')
          .setStyle(ButtonStyle.Secondary),
      ]

      const row = new ActionRowBuilder().addComponents(buttons)

      this.reply = await reply.reply({
        embeds: [this.embed],
        //@ts-expect-error weird error, it works just fine
        components: [row],
      })

      let loop = true

      while (loop) {
        const reply = this.reply
        const button = await reply.awaitMessageComponent({
          time: 30_000,
        })

        if (button.customId === 'true') {
          loop = false
          this.embed = this.embed.setDescription('Espera...')
          await reply.edit({ embeds: [this.embed], components: [] })
          const mapa = await MapasOsu.generateDailyMap()

          const currentDate = new Date()
          const day = currentDate.getDate()
          const month = currentDate.getMonth() + 1
          const year = currentDate.getFullYear()

          await this.mapasRepository.create({
            oldMaps: mapa.id,
            oldMapMods: JSON.stringify(mapa.mods),
            oldMapMinRank: mapa.minRank,
            mapName: mapa.name,
            date: `${day}/${month.toString().padStart(2, '0')}/${year}`,
            picUrl: mapa.picUrl
          })
          MapasOsu.dailyMap = mapa

          
          await reply.edit({
            embeds: [this.embed.setDescription('Daily map skipped')],
            components: [],
          })
        } else if (button.customId === 'false') {
          loop = false
          this.embed = this.embed.setDescription('Cancelled')
          await reply.edit({ embeds: [this.embed], components: [] })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}
