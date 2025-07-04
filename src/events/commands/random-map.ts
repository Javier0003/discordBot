import {
  CacheType,
  ChatInputCommandInteraction,
} from 'discord.js'
import Command from '../../structures/command-builder'
import { getMapaRandom } from '../events/daily-map'

export default class randomMap extends Command {
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
      this.embed = this.embed.setTitle('osu! Random Map').setDescription('Espera un momento')
      this.reply = interaction.reply({ embeds: [this.embed]})

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
