import {
  CacheType,
  CommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  Message
} from 'discord.js'
import Command_Builder from '../../structures/command-builder'

export default class OsuDaly extends Command_Builder {
  reply: Promise<InteractionResponse<boolean> | Message> | undefined
  embed: EmbedBuilder = new EmbedBuilder()
    .setTitle('osu! Daly map')
    .setDescription('Espera un momento')

  constructor() {
    super({
      name: 'osu-daly',
      description: 'osu!'
    })
  }
  public async command(
    interaction: CommandInteraction<CacheType>
  ): Promise<void> {
    try {
      this.reply = interaction.reply({ embeds: [this.embed], ephemeral: false })

      fetch('https://osu.ppy.sh/users/10766138/extra-pages/recent_activity?mode=osu', {
        method: 'GET',
        headers: {
          'Content-Type': 'application'
        }
      })
        .then((res) => res.json())
        .then((data: any) => {
          for (let i = 0; i < data.items.length; i++) {
            console.log(data.items[i])
            // console.log(`rank: ${data.items[i].scoreRank}`)
            // console.log(`map: ${data.items[i].beatmap.title}`)
          }
        })
      console.log('osu-daly')
    } catch (error) {
      console.log(error)
    }
  }
}
