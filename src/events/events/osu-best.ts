import { EmbedBuilder, Message } from 'discord.js'
import Event_Builder from '../../structures/event-builder'
import getOsuToken from '../../utils/osu-token'
import { db } from '../../utils/db'
import { users } from '../../../drizzle/schemas/schema'
import { Welcome } from '../../utils/osu-daily.config'
import OsuDaily from '../commands/osu-daily'

export default class OsuBest extends Event_Builder<'messageCreate'> {
  constructor() {
    super({ eventType: 'messageCreate', type: 'on' })
  }

  async event(message: Message<boolean>): Promise<void> {
    try {
      if (message.author.bot) return
      if (!message.reference) return
      if (message.content !== '!compare') return
      if (!message.reference.messageId) return

      const content = await message.channel.messages.fetch(message.reference.messageId)

      if (content.embeds.length === 0) return

      const mapId = content.embeds[0].author?.url?.split('/').at(-1)

      const token = await getOsuToken()
      const usersData = await db.select().from(users)

      const data = await Promise.all(
        usersData.map(async (v) => {
          const res = await fetch(`https://osu.ppy.sh/api/v2/beatmaps/${mapId}/scores/users/${v.osuId}/all`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          })
          return res.json()
        })
      ) as Welcome[]

      const scores = []

      for (let i = 0; i < data.length; i++) {
        const element = data[i]
        if (element.scores.length === 0) continue
        scores.push(element.scores.filter((f) => f.score === element.scores.reduce((a, b) => a.score > b.score ? a : b).score))
      }

      const sorted = scores.sort((a, b) => b[0].score - a[0].score)

      const embed = new EmbedBuilder()
        .setTitle(`Best scores for ${content.embeds[0].author?.name}`)
        .setURL(`${content.embeds[0].author?.url}`)
        .setThumbnail(`${content.embeds[0].thumbnail?.url}`)
        .setColor('Random')

      sorted.forEach(([v]) => {
        const user = usersData.find((f) => f.osuId === v.user_id)
        embed.addFields([{ name: user?.name || 'Unknown', value: `Score: ${v.score.toString()}\nAccuracy: ${OsuDaily.accuracy(v.accuracy)}%\nCombo: ${v.max_combo}x\nRank: ${v.rank}\nMods: ${v.mods.length === 0 ? "no mod" : v.mods}\n` }])
      })

      message.channel.send({ embeds: [embed] })
    } catch (error) {
      console.log(error)
    }

  }
}