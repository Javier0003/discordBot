import Event_Builder, { EventCommand } from '../../structures/event-builder'
import { mapas } from '../../../drizzle/schemas/schema'
import { db } from '../../utils/db'
import { eq } from 'drizzle-orm'
import getOsuToken, { Beatmap } from '../../utils/osu-token'

export type mods =
  | 'HD'
  | 'DT'
  | 'HR'
  | 'NF'
  | 'EZ'
  | 'HT'
  | 'SD'
  | 'NC'
  | 'PF'
  | 'FL'
  | 'RX'
  | 'AP'
  | 'SO'

type OsuRanks = 'D' | 'C' | 'B' | 'A' | 'S' | 'SS'

type DailyMap = {
  id: number
  mods: mods[]
  minRank: OsuRanks
}

export default class MapasOsu extends Event_Builder implements EventCommand {
  public static dailyMap: DailyMap
  constructor() {
    super({ type: 'ready' })
  }

  public async event() {
    try {
      if (!MapasOsu.dailyMap) {
        const restartBot = await db.select().from(mapas)

        if (restartBot.length === 0) {
          const mapaRandom = await generateDailyRandomMap()
          await db.insert(mapas).values({
            oldMapId: mapaRandom.id,
            oldMapMods: JSON.stringify(mapaRandom.mods),
            oldMapMinRank: mapaRandom.minRank
          })
          MapasOsu.dailyMap = mapaRandom
        }

        MapasOsu.dailyMap = {
          id: restartBot[restartBot.length - 1].oldMapId,
          mods: JSON.parse(restartBot[restartBot.length - 1].oldMapMods) as mods[],
          minRank: restartBot[restartBot.length - 1].oldMapMinRank as OsuRanks
        }
      }

      setInterval(async () => {
        const mapaRandom = await generateDailyRandomMap()
        await db
          .insert(mapas)
          .values({
            oldMapId: mapaRandom.id,
            oldMapMods: JSON.stringify(mapaRandom.mods),
            oldMapMinRank: mapaRandom.minRank
          })
        MapasOsu.dailyMap = mapaRandom
      }, 86400000)
    } catch (error) {
      console.log(error)
    }
  }
}

type statistics = {
  count_100: number | null
  count_300: number | null
  count_50: number | null
  count_geki: number | null
  count_katu: number | null
  count_miss: number | null
}

export type Score = {
  accuracy: number
  best_id: number | null
  created_at: string
  id: number
  max_combo: number
  mode: string
  mode_int: number
  mods: mods[] // Specify the type if known, e.g., string[]
  passed: boolean
  perfect: boolean
  pp: number | null
  rank: string
  replay: boolean
  score: number
  statistics: {
    count_100: number
    count_300: number
    count_50: number
    count_geki: number | null
    count_katu: number | null
    count_miss: number
  }
  type: string
  user_id: number
  current_user_attributes: {
    pin: number | null
  }
  beatmap: {
    beatmapset_id: number
    difficulty_rating: number
    id: number
    mode: string
    status: string
    total_length: number
    user_id: number
    version: string
    accuracy: number
    ar: number
    bpm: number
    convert: boolean
    count_circles: number
    count_sliders: number
    count_spinners: number
    cs: number
    deleted_at: string | null
    drain: number
    hit_length: number
    is_scoreable: boolean
    last_updated: string
    mode_int: number
    passcount: number
    playcount: number
    ranked: number
    url: string
    checksum: string
  }
  beatmapset: {
    artist: string
    artist_unicode: string
    covers: {
      cover: string
      'cover@2x': string
      card: string
      'card@2x': string
      list: string
      'list@2x': string
      slimcover: string
      'slimcover@2x': string
    }
    creator: string
    favourite_count: number
    hype: null | number
    id: number
    nsfw: boolean
    offset: number
    play_count: number
    preview_url: string
    source: string
    spotlight: boolean
    status: string
    title: string
    title_unicode: string
    track_id: number | null
    user_id: number
    video: boolean
  }
  user: {
    avatar_url: string
    country_code: string
    default_group: string
    id: number
    is_active: boolean
    is_bot: boolean
    is_deleted: boolean
    is_online: boolean
    is_supporter: boolean
    last_visit: string
    pm_friends_only: boolean
    profile_colour: string | null
    username: string
  }
}

export type UserPlay = {
  accuracy: number
  max_combo: number
  mods: mods[]
  passed: boolean
  perfect: boolean
  rank: OsuRanks
  statistics: statistics
  score: number
}

const osuMods = [
  'nomod',
  'HD',
  'DT',
  'HR',
  'NF',
  'EZ',
  'HT',
  'NC',
  'FL',
]

const osuRanks = ['D', 'C', 'B', 'A', 'S']

async function generateDailyRandomMap(): Promise<DailyMap> {
  try {
    const map = await getMapaRandom()
    const selectedMods: mods[] | 'nomod'[] = []


    for (let i = 0; i < Math.floor(Math.random() * 2) + 1; i++) {
      if (selectedMods[0] === 'nomod') break
      getMods(selectedMods)
    }

    const dailyMap: DailyMap = {
      id: map.id,
      mods: selectedMods,
      minRank: osuRanks[Math.floor(Math.random() * osuRanks.length)]
    } as DailyMap

    const mapInDb = await db
      .select()
      .from(mapas)
      .where(eq(mapas.oldMapId, map.id))
    if (mapInDb.length !== 0) return await generateDailyRandomMap()

    return dailyMap
  } catch (error) {
    console.log(error)
    return await generateDailyRandomMap()
  }
}

export async function getMapaRandom(): Promise<Beatmap> {
  try {
    const token = await getOsuToken()
    const mapaRandomXd = Math.floor(Math.random() * 4705543)
    const json = await fetch(
      `https://osu.ppy.sh/api/v2/beatmaps/${mapaRandomXd}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
    const data = (await json.json()) as Beatmap
    if (data.mode !== 'osu') return await getMapaRandom()
    return data
  } catch (error) {
    console.log(error)
    return await getMapaRandom()
  }
}

function getMods(selectedMods: string[]): void {
  const randomMod = Math.floor(Math.random() * osuMods.length)
  if (selectedMods.length === 0) {
    selectedMods.push(osuMods[randomMod])
    return
  }

  if (selectedMods.indexOf(osuMods[randomMod]) === -1) {
    if (selectedMods.length !== 0 && osuMods[randomMod] === 'nomod')
      return getMods(selectedMods)
    selectedMods.push(osuMods[randomMod])
    return
  }
  getMods(selectedMods)
}
