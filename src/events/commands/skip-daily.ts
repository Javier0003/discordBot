import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CacheType,
  ChatInputCommandInteraction,
} from 'discord.js'
import Command from '../../structures/command-builder'
import MapasOsu from '../events/daily-map'

export default class skipDaily extends Command {
  constructor() {
    super({
      name: 'skip-daily',
      description: 'Skip the daily',
      devOnly: true,
      testOnly: false,
      deleted: false,
      notUpdated: true,
    })
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

      this.reply = reply.reply({
        embeds: [this.embed],
        //@ts-expect-error weird error, it works just fine
        components: [row],
      })

      let loop = true

      while (loop) {
        const reply = await this.reply
        const button = await reply.awaitMessageComponent({
          time: 30_000,
        })

        if (button.customId === 'true') {
          loop = false
          this.embed = this.embed.setDescription('Espera...')
          await reply.edit({ embeds: [this.embed], components: [] })
          await MapasOsu.getDailyMap()
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
