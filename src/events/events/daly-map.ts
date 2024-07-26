import { Message } from 'discord.js'
import Event_Builder, { EventCommand } from '../../structures/event-builder'
import { mapas } from '../../../drizzle/schemas/schema'
import { db } from '../../utils/db'
import env from '../../env'
import { eq } from 'drizzle-orm'

type OsuMods = 'nomod'
type OsuRanks = 'D' | 'C' | 'B' | 'A' | 'S' | 'SS'



type DalyMap = {
  id: number
  mods: OsuMods
  minRank: OsuRanks
}

export default class MapasOsu extends Event_Builder implements EventCommand {
  public static mapa_diario: number
  constructor() {
    super({ type: 'ready' })
  }

  public async event() {

    try {
      if(!MapasOsu.mapa_diario) {
        const restartBot = await db.select().from(mapas)

        if(restartBot.length === 0) {
          const mapaRandom = await getMapaRandom()
          await db.insert(mapas).values({oldMaps: mapaRandom.id})
          MapasOsu.mapa_diario = mapaRandom.id
        } 
        MapasOsu.mapa_diario = restartBot[restartBot.length - 1].oldMaps
      }

      setInterval(async () => {
        const mapaRandom = await getMapaRandom()
        await db.insert(mapas).values({oldMaps: mapaRandom.id})
        MapasOsu.mapa_diario = mapaRandom.id
      }, 86400000)
    } catch (error) {
      console.log(error)
    }
  }
}


async function getMapaRandom(): Promise<any> {
  const osuMods = ['nomod']
  const osuRanks = ['D', 'C', 'B', 'A', 'S']

  const mapaRandomXd = Math.floor(Math.random() * 4705543)
  const json = await fetch(
    `https://osu.ppy.sh/api/v2/beatmaps/${mapaRandomXd}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization:
          `Bearer ${env.osuToken}`
      }
    }
  )
  const data: any = await json.json()

  if (data.mode !== 'osu') return await getMapaRandom()
  
  const mapInDb = await db.select().from(mapas).where(eq(mapas.oldMaps, data.id))
  if (mapInDb.length !== 0) return await getMapaRandom()

  return data
}