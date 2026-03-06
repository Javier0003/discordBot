import { VoiceState } from 'discord.js'
import Event_Builder from '../../builders/event-builder'

export default class Deafen extends Event_Builder<'voiceStateUpdate'> {
  constructor() {
    super({ eventType: 'voiceStateUpdate', type: 'on', name: 'Deafen' })
  }

  public static mover(newState: VoiceState) {
    if (newState.channel?.id !== '1136770981873065984') {
      try {
        newState.member?.voice.setChannel('1136770981873065984')
      } catch (error) {
        console.log(error)
      }
    }
  }


  public event(oldState: VoiceState, newState: VoiceState) {
    try {
      if (oldState.member?.id === '411916947773587456') return

      if (
        oldState.channel === null &&
        oldState.selfDeaf === true &&
        newState.selfDeaf === false &&
        newState.channel !== null
      )
        return

      if (
        oldState.selfDeaf &&
        oldState.channel === null &&
        newState.channel !== null
      )
        Deafen.mover(newState)

      if (
        oldState.channelId === '1136770981873065984' &&
        newState.selfDeaf &&
        oldState.selfDeaf &&
        newState.channel !== null
      )
        Deafen.mover(newState)

      if (newState.serverDeaf && newState.member?.id === '423578223725510657')
        Deafen.mover(newState)

      if (oldState.serverDeaf && newState.member?.id === '423578223725510657')
        Deafen.mover(newState)

      if (newState.selfDeaf && !oldState.selfDeaf) Deafen.mover(newState)
    } catch (error) {
      console.log(error)
    }
  }
}
