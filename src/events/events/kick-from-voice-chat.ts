import { VoiceState } from 'discord.js'
import Event_Builder from '../../structures/event-builder'
import { db } from '../../utils/db'
import { eq } from 'drizzle-orm'
import { serverUsers } from '../../../drizzle/schemas/schema'

export default class KickFromVoiceChat extends Event_Builder<'voiceStateUpdate'> {
  constructor() {
    super({ eventType: 'voiceStateUpdate', type: 'on' })
  }

  public async event(oldState: VoiceState, newState: VoiceState) {
    try {
      if (!newState.member?.id) return

      const channel = oldState.guild.channels.cache.get(newState.channelId ?? '')

      const members = channel?.members

      // @ts-expect-error this works even tho it says it doesn't
      members?.forEach((member, id) => {
        if (id === '642690500276649985' && oldState.id === '262008667002503174') {
          KickFromVoiceChat.kick(newState)
        }
      })

      const bannedUsers = await db.select().from(serverUsers).where(eq(serverUsers.idServerUser, newState.member?.id))

      if (bannedUsers.length > 0) {
        if (newState.channelId !== null) {
          KickFromVoiceChat.kick(newState)
        }
      } else {
        if (newState.channelId === null) {
          KickFromVoiceChat.kick(newState)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  private static kick(newState: VoiceState) {
    newState.member?.voice.setChannel(null)
  }
}
