import { VoiceState } from 'discord.js'
import Event_Builder from '../../builders/event-builder'
import { RepositoryObj } from '../../repositories/services-registration'

export default class KickFromVoiceChat extends Event_Builder<'voiceStateUpdate'> {
  private readonly serverUsersRepository: RepositoryObj['serverUsersRepository']
  constructor({ serverUsersRepository }: RepositoryObj) {
    super({ eventType: 'voiceStateUpdate', type: 'on', name: 'kick-from-voice-chat' })
    this.serverUsersRepository = serverUsersRepository
  }

  public async event(oldState: VoiceState, newState: VoiceState) {
    try {
      if (!newState.member?.id) return

      const channel = oldState.guild.channels.cache.get(newState.channelId ?? '')

      const members = channel?.members

      // @ts-expect-error this works even tho it says it doesn't
      members?.forEach((member, id) => {
        if (id === '642690500276649985' && oldState.id === '262008667002503174') {
          this.kick(newState)
        }
      })

      const bannedUsers = await this.serverUsersRepository.isUserBanned(newState.member.id)

      if (bannedUsers) {
        if (newState.channelId !== null) {
          this.kick(newState)
        }
      } else {
        if (newState.channelId === null) {
          this.kick(newState)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  private kick(newState: VoiceState) {
    newState.member?.voice.setChannel(null)
  }
}
