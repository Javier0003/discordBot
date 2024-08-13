import Event_Builder, { EventCommand } from '../../structures/event-builder'
import { mapas, plays, users } from '../../../drizzle/schemas/schema'
import { db } from '../../utils/db'
import { eq, sql } from 'drizzle-orm'
import getOsuToken, { Beatmap } from '../../utils/osu-token'

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
  | 'nomod'

export type OsuRanks = 'D' | 'C' | 'B' | 'A' | 'S' | 'SS'

export type DailyMap = {
  id: number
  mods: mods[]
  minRank: OsuRanks
}

type dailyPlays = {
  uid: string
  mapId: number
  score: number
  rank: OsuRanks
  accuracy: number
  points: number
}

function generateDifficulty() {
  const mods: mods[] = []

  const speedRoll = Math.random() * 100
  if (speedRoll < 75) {
    // No speed mod (NoMod)
  } else if (speedRoll < 98) {
    mods.push(Math.random() < 0.5 ? 'DT' : 'NC')
  } else {
    mods.push('HT')
  }

  const diffRoll = Math.random() * 100
  if (diffRoll < 75) {
    // No difficulty mod (NoMod)
  } else if (diffRoll < 98) {
    mods.push('HR')
  } else {
    mods.push('EZ')
  }

  if (Math.random() < 0.2) {
    mods.push('HD')
  }

  if (Math.random() < 0.05) {
    mods.push('FL')
  }

  if (Math.random() < 0.01) {
    mods.push('NF')
  }

  while (!validateCombos(mods)) {
    return generateDifficulty()
  }

  return mods
}

function getRandomDifficulty(): OsuRanks {
  const difficulties = ['D', 'C', 'B', 'A', 'S', 'SS'] as OsuRanks[]
  const weights = [2, 8, 32, 16, 2, 1]

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  const randomNum = Math.random() * totalWeight

  let weightSum = 0
  for (let i = 0; i < difficulties.length; i++) {
    weightSum += weights[i]
    if (randomNum <= weightSum) {
      return difficulties[i]
    }
  }

  return difficulties[0]
}

export async function generateDailyRandomMap(): Promise<DailyMap> {
  try {
    const selectedMods: mods[] = generateDifficulty()

    const map = await getMapaRandom(selectedMods)

    const osuRanks = getRandomDifficulty()

    const dailyMap: DailyMap = {
      id: map.id,
      mods: selectedMods,
      minRank: osuRanks
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

async function mapa(token: string, selectedMods?: mods[]): Promise<Beatmap> {
  try {
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
    if (data.mode !== 'osu') return await mapa(token, selectedMods)

    if (!selectedMods) {
      return data
    }

    if (!(await checkDifficultyRating(token, selectedMods, data)))
      return await mapa(token, selectedMods)

    return data
  } catch (error) {
    console.log(error)
    return await mapa(token, selectedMods)
  }
}

export async function getMapaRandom(selectedMods?: mods[]): Promise<Beatmap> {
  const token = await getOsuToken()
  try {
    if (!selectedMods) {
      return await mapa(token)
    }

    return await mapa(token, selectedMods)
  } catch (error) {
    console.log(error)
    if (!selectedMods) {
      return await getMapaRandom()
    }
    return await mapa(token, selectedMods)
  }
}

function validateCombos(input: mods[]): boolean {
  const invalidCombos: mods[][] = [
    ['DT', 'EZ'],
    ['HT', 'EZ']
  ]

  for (const combo of invalidCombos) {
    if (combo.every((item) => input.includes(item as mods))) {
      return false
    }
  }

  return true
}

async function checkDifficultyRating(
  token: string,
  selectedMods: mods[] | 'nomod'[],
  map: Beatmap
): Promise<boolean> {
  if (map.difficulty_rating >= 8) return false
  if (selectedMods[0] === 'nomod') return true
  const json = await fetch(
    `https://osu.ppy.sh/api/v2/beatmaps/${map.id}/attributes`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ruleset: 'osu',
        mods: selectedMods
      })
    }
  )

  const newData = (await json.json()) as BeatmapAttributes
  if (!validateDifficultyLimits(newData, selectedMods)) return false

  return true
}

function validateDifficultyLimits(
  map: BeatmapAttributes,
  selectedMods: mods[]
): boolean {
  if (!process.env.REGISTER_ALL) {
    console.log('----------------------------------------------------')
    console.log(`star rating: ${map.attributes.star_rating}`)
    console.log(`mods: ${selectedMods}`)

    console.log(
      `validar DT and * > 7: ${
        map.attributes.star_rating >= 7 && selectedMods.includes('DT')
      }`
    )

    console.log(`Validar NF: ${selectedMods.includes('NF')}`)

    console.log(
      `validar NC and * > 7: : ${
        map.attributes.star_rating >= 7 && selectedMods.includes('NC')
      }`
    )
    console.log(
      `validar EZ and * > 6: : ${
        map.attributes.star_rating > 6 && selectedMods.includes('EZ')
      }`
    )

    console.log(
      `Validar HR/HDHR and * > 7: ${
        map.attributes.star_rating >= 7 && selectedMods.includes('HR')
      }`
    )

    console.log(
      `Validar FL: ${
        map.attributes.star_rating >= 5 && selectedMods.includes('FL')
      }`
    )

    console.log(
      `Validar FL and DT * > 3.7: ${
        map.attributes.star_rating >= 3.7 && selectedMods.includes('DT')
      }`
    )
    console.log(
      `Validar: FL and NC * > 3.7: ${
        map.attributes.star_rating >= 3.7 && selectedMods.includes('NC')
      }`
    )

    console.log(`Validar 4⭐: ${map.attributes.star_rating >= 4}`)

    console.log('----------------------------------------------------')
  }

  if (selectedMods.includes('NF')) return true

  if (map.attributes.star_rating >= 7 && selectedMods.includes('HR'))
    return false

  if (map.attributes.star_rating >= 7 && selectedMods.includes('DT'))
    return false

  if (map.attributes.star_rating >= 7 && selectedMods.includes('NC'))
    return false

  if (selectedMods.includes('EZ')) {
    if (map.attributes.star_rating > 6) return false
    if (selectedMods.includes('DT') && map.attributes.star_rating >= 3.7)
      return false
    if (selectedMods.includes('NC') && map.attributes.star_rating >= 3.7)
      return false
    return true
  }

  if (map.attributes.star_rating < 4 && !selectedMods.includes('FL'))
    return false

  if (selectedMods.includes('FL') && map.attributes.star_rating >= 5)
    return false

  return true
}

type BeatmapAttributes = {
  attributes: {
    star_rating: number
    approach_rate: number | null
  }
}

export default class MapasOsu extends Event_Builder implements EventCommand {
  public static dailyMap: DailyMap
  private static dailyPlays: dailyPlays[] = []

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
          return
        }

        MapasOsu.dailyMap = {
          id: restartBot[restartBot.length - 1].oldMapId,
          mods: JSON.parse(
            restartBot[restartBot.length - 1].oldMapMods
          ) as mods[],
          minRank: restartBot[restartBot.length - 1].oldMapMinRank as OsuRanks
        }
      }

      setInterval(async () => {
        await MapasOsu.getDailyMap()
        await MapasOsu.savePlays()
        MapasOsu.dailyPlays = []
      }, 86400000)
    } catch (error) {
      console.log(error)
    }
  }

  public static async getDailyMap() {
    const mapaRandom = await generateDailyRandomMap()
    await db.insert(mapas).values({
      oldMapId: mapaRandom.id,
      oldMapMods: JSON.stringify(mapaRandom.mods),
      oldMapMinRank: mapaRandom.minRank
    })
    MapasOsu.dailyMap = mapaRandom
  }

  public static async savePlays() {
    const order = MapasOsu.dailyPlays.sort((a, b) => a.score - b.score)

    for (let i = 0; i < order.length; i++) {
      order[i].points += order.length - i - 1
      
      await db.insert(plays).values({
        accuracy: order[i].accuracy.toString(),
        mapId: order[i].mapId,
        rank: order[i].rank,
        score: order[i].score,
        uId: order[i].uid
      })
      await db
        .update(users)
        .set({
          puntos: sql`${users.puntos} + ${order[i].points}`
        })
        .where(eq(users.id, order[i].uid.toString()))
    }
  }

  public static addPlay(play: dailyPlays) {
    const found = MapasOsu.dailyPlays.map((p) => p.uid).indexOf(play.uid)
    if (found !== -1) {
      if (MapasOsu.dailyPlays[found].score < play.score) {
        MapasOsu.dailyPlays[found] = play
      }
      return
    }
    MapasOsu.dailyPlays.push(play)
  }
}
