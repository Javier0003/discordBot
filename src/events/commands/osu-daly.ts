import {
  CacheType,
  CommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  Message
} from 'discord.js'
import Command_Builder from '../../structures/command-builder'
import { mapas, users } from '../../../drizzle/schemas/schema'
import { eq } from 'drizzle-orm'
import env from '../../env'
import MapasOsu from '../events/daly-map'
import { db } from '../../utils/db'

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
    this.reply = interaction.reply({ embeds: [this.embed], ephemeral: false })
    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, interaction.user.id))

      if (user.length === 0) throw new Error('No estas registrado')

      const dalyMap = MapasOsu.mapa_diario
      const dalyFetchRes = await fetch(
        `https://osu.ppy.sh/api/v2/beatmaps/${dalyMap}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${env.osuToken}`
          }
        }
      )
      const daly: any = await dalyFetchRes.json()

      const json = await fetch(`https://osu.ppy.sh/api/v2/users/${user[0].osuId}/scores/recent?include_fails=0&mode=osu&limit=5`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization:
            `Bearer ${env.osuToken}`
        }
      })
      const userPlays: any = await json.json()

      const userPlay = userPlays.find(
        (play: any) => play.beatmap.id === dalyMap
      )

      console.log(userPlay)

      this.embed = (await this.embed)
        .setThumbnail(daly.beatmapset.covers.list)
        .setURL(daly.url)
        .setTitle(daly.beatmapset.title).setColor('Random')

      this.reply = (await this.reply).edit({ embeds: [this.embed] })
    } catch (error: any) {
      if (error.message === 'No estas registrado') {
        this.reply = (await this.reply).edit({
          content: 'No estas registrado',
          embeds: []
        })
      } else {
        console.log(error)
      }
    }
  }
}
