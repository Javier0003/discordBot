import { ActivityType } from 'discord.js'
import Event_Builder from '../../structures/event-builder'
import LoaClient from '../../structures/loa-client'

const status = [
  {
    name: 'sexo',
    type: ActivityType.Streaming,
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    name: 'La Mejor Pagina',
    type: ActivityType.Watching
  },
  {
    name: 'ser racista',
    type: ActivityType.Playing
  },
  {
    name: 'If I were spanish',
    type: ActivityType.Streaming,
    url: 'https://www.youtube.com/watch?v=BBASjkTksZg'
  },
  {
    name: 'We win those',
    type: ActivityType.Streaming,
    url: 'https://www.youtube.com/watch?v=O8uz8hyrqws'
  },
  {
    name: 'Donut',
    type: ActivityType.Streaming,
    url: 'https://www.youtube.com/watch?v=l0cWItYA3kE'
  }
]

export default class Status extends Event_Builder<'ready'> {
  constructor() {
    super({ eventType: 'ready', type: 'on', name: 'status' })
  }

  public event() {
    try {
      setInterval(() => {
        const random = Math.floor(Math.random() * status.length)
        LoaClient.LoA.user?.setActivity(status[random])
      }, 10000)
    } catch (error) {
      console.log(error)
    }
  }
}