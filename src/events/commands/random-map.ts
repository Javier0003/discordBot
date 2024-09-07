import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  Message
} from 'discord.js'
import Command_Builder from '../../structures/command-builder'
import { getMapaRandom } from '../events/daily-map'

export default class randomMap extends Command_Builder {
  reply: Promise<InteractionResponse<boolean> | Message> | undefined
  embed: EmbedBuilder = new EmbedBuilder()
    .setTitle('osu! Random Map')
    .setDescription('Espera un momento')

  constructor() {
    super({
      name: 'random-map',
      description: 'Random osu! map',
      notUpdated: true
    })
  }
  public async command(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    try {
      this.reply = interaction.reply({ embeds: [this.embed], ephemeral: false })

      const randomMap = await getMapaRandom()

      this.embed = (await this.embed)
        .setThumbnail(randomMap.beatmapset.covers.list)
        .setURL(randomMap.url)
        .setTitle(randomMap.beatmapset.title)
        .setColor('Random')
        .setDescription(
          `Difficulty: ${randomMap.difficulty_rating} ★\n${randomMap.beatmapset.artist} - ${randomMap.beatmapset.title} [${randomMap.version}] \n Max Combo: ${randomMap.max_combo}`
        )

      this.reply = (await this.reply).edit({ embeds: [this.embed] })
    } catch (error) {
      console.log(error)
    }
  }
}
