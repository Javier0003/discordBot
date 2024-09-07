import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  Message
} from 'discord.js'
import Command_Builder from '../../structures/command-builder'
import MapasOsu from '../events/daily-map'

export default class skipDaily extends Command_Builder {
  embed: EmbedBuilder = new EmbedBuilder()
    .setTitle('Skipping daily map')
    .setColor('Red')
    .setDescription('Confirm?')

  interaction: Promise<InteractionResponse<boolean> | Message> | undefined
  constructor() {
    super({
      name: 'skip-daily',
      description: 'Skip the daily',
      devOnly: true,
      testOnly: false,
      options: [],
      deleted: false
      // notUpdated: true
    })
  }

  async command(interaction: ChatInputCommandInteraction<CacheType>) {
    try {
      const buttons = [
        new ButtonBuilder()
          .setCustomId('true')
          .setLabel('Yes')
          .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
          .setCustomId('false')
          .setLabel('No')
          .setStyle(ButtonStyle.Secondary)
      ]

      const row = new ActionRowBuilder().addComponents(buttons)

      this.interaction = interaction.reply({
        embeds: [this.embed],
        ephemeral: false,
        //@ts-expect-error weird error, it works just fine
        components: [row]
      })

      let loop = true

      while (loop){
        const reply = await this.interaction
        const button = await reply.awaitMessageComponent({
          time: 30_000
        })

        if (button.customId === 'true'){
          loop = false
          this.embed = this.embed.setDescription('Skipped')
          await reply.edit({embeds: [this.embed], components: []})
          await MapasOsu.getDailyMap()
        } else if (button.customId === 'false'){
          loop = false
          this.embed = this.embed.setDescription('Cancelled')
          await reply.edit({embeds: [this.embed], components: []})
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}
