import Event_Builder, { EventCommand } from '../../structures/event-builder'
import { mapas, plays } from '../../../drizzle/schemas/schema'
import { db } from '../../utils/db'
import { eq } from 'drizzle-orm'
import getOsuToken from '../../utils/osu-token'
import osuConfig, {
  Beatmap,
  DailyMap,
  dailyPlays,
  mods,
  OsuRanks
} from '../../utils/osu-daily.config'

function generateDifficulty() {
  const mods: mods[] = []

  const speedRoll = Math.random() * 100
  if (speedRoll < osuConfig.modChances.speed.nomod) {
    // No speed mod (NoMod)
  } else if (speedRoll < osuConfig.modChances.speed.DTNC) {
    mods.push(Math.random() < 0.5 ? 'DT' : 'NC')
  } else {
    mods.push('HT')
  }

  const diffRoll = Math.random() * 100
  if (diffRoll < osuConfig.modChances.diff.nomod) {
    // No difficulty mod (NoMod)
  } else if (diffRoll < osuConfig.modChances.diff.hr) {
    mods.push('HR')
  } else {
    mods.push('EZ')
  }

  if (Math.random() < osuConfig.modChances.HD) {
    mods.push('HD')
  }

  if (Math.random() < osuConfig.modChances.FL) {
    mods.push('FL')
  }

  if (Math.random() < osuConfig.modChances.NF) {
    mods.push('NF')
  }

  while (!validateCombos(mods)) {
    return generateDifficulty()
  }

  return mods
}

function getRandomDifficulty(): OsuRanks {
  const totalWeight = osuConfig.difficultyWeights.reduce(
    (sum, weight) => sum + weight,
    0
  )
  const randomNum = Math.random() * totalWeight

  let weightSum = 0
  for (let i = 0; i < osuConfig.ranks.length; i++) {
    weightSum += osuConfig.difficultyWeights[i]
    if (randomNum <= weightSum) {
      return osuConfig.ranks[i]
    }
  }

  return osuConfig.ranks[0]
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
    const mapaRandomXd = Math.floor(
      Math.random() * osuConfig.mapGeneratorNumber
    )
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
    if ([1, 2, 3, 4].indexOf(data.ranked) === -1)
      return await mapa(token, selectedMods)

    if(data.beatmapset.availability.download_disabled) return await mapa(token, selectedMods)

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
  const invalidCombos: mods[][] = osuConfig.badModCombos

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
  if (map.difficulty_rating >= osuConfig.dailyMaps.maximumDifficulty)
    return false
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
    console.log(map.attributes.star_rating)
    console.log(`Validar 4⭐: ${map.attributes.star_rating >= 4}`)

    console.log('----------------------------------------------------')
  }

  if (selectedMods.includes('EZ')) {
    if (map.attributes.star_rating > osuConfig.dailyMaps.modConfig.EZMax)
      return false
    if (
      selectedMods.includes('DT') &&
      map.attributes.star_rating >= osuConfig.dailyMaps.modConfig.anyDTMax
    )
      return false
    if (
      selectedMods.includes('NC') &&
      map.attributes.star_rating >= osuConfig.dailyMaps.modConfig.anyDTMax
    )
      return false
    return true
  }

  if (selectedMods.includes('FL')) {
    if (map.attributes.star_rating >= osuConfig.dailyMaps.modConfig.FLMax)
      return false
    if (
      selectedMods.includes('DT') &&
      map.attributes.star_rating >= osuConfig.dailyMaps.modConfig.anyDTMax
    )
      return false
    if (
      selectedMods.includes('NC') &&
      map.attributes.star_rating >= osuConfig.dailyMaps.modConfig.anyDTMax
    )
      return false
    return true
  }

  if (
    map.attributes.star_rating < osuConfig.dailyMaps.minimumDifficulty
  ) {
    return false
  }

  if (selectedMods.includes('NF')) return true

  if (
    map.attributes.star_rating >= osuConfig.dailyMaps.modConfig.HRMax &&
    selectedMods.includes('HR')
  )
    return false

  if (
    map.attributes.star_rating >= osuConfig.dailyMaps.modConfig.DTMax &&
    selectedMods.includes('DT')
  )
    return false

  if (
    map.attributes.star_rating >= osuConfig.dailyMaps.modConfig.NCMax &&
    selectedMods.includes('NC')
  )
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
        } else {
          MapasOsu.dailyMap = {
            id: restartBot[restartBot.length - 1].oldMapId,
            mods: JSON.parse(
              restartBot[restartBot.length - 1].oldMapMods
            ) as mods[],
            minRank: restartBot[restartBot.length - 1].oldMapMinRank as OsuRanks
          }
        }
      }

      MapasOsu.triggerAt5AM(async () => {
        await MapasOsu.getDailyMap()
        await MapasOsu.savePlays()
        MapasOsu.dailyPlays = []
      })
    } catch (error) {
      console.log(error)
    }
  }

  public static triggerAt5AM(callback: () => Promise<void>) {
    function scheduleNext() {
      const now = new Date()
      const nextTrigger = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        osuConfig.dailyChangeHour, // Hour
        0, // Minute
        0 // Second
      )

      if (now > nextTrigger) {
        nextTrigger.setDate(nextTrigger.getDate() + 1)
      }

      const timeUntilTrigger = nextTrigger.getTime() - now.getTime()

      setTimeout(async () => {
        await callback()
        scheduleNext()
      }, timeUntilTrigger)
    }

    scheduleNext()
  }

  private static async getDailyMap() {
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
      order[i].points += i

      await db.insert(plays).values({
        accuracy: order[i].accuracy.toString(),
        mapId: order[i].mapId,
        rank: order[i].rank,
        score: order[i].score,
        uId: order[i].uid,
        puntos: order[i].points
      })
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
