import Event_Builder from '../../builders/event-builder'
import getOsuToken from '../../utils/osu-token'
import osuConfig, {
  Beatmap,
  DailyMap,
  mods,
  OsuRanks,
} from '../../utils/osu-daily.config'
import { RepositoryObj } from '../../repositories/services-registration'

export function generateDifficulty() {
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

export function getRandomDifficulty(): OsuRanks {
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


export async function mapa(token: string, selectedMods?: mods[]): Promise<Beatmap> {
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
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const data = (await json.json()) as Beatmap
    if (data.mode !== 'osu') return await mapa(token, selectedMods)
    if ([1, 2, 3, 4].indexOf(data.ranked) === -1)
      return await mapa(token, selectedMods)

    if (data.beatmapset.availability.download_disabled)
      return await mapa(token, selectedMods)

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
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ruleset: 'osu',
        mods: selectedMods,
      }),
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
      `validar DT and * > 7: ${map.attributes.star_rating >= 7 && selectedMods.includes('DT')
      }`
    )

    console.log(`Validar NF: ${selectedMods.includes('NF')}`)

    console.log(
      `validar NC and * > 7: : ${map.attributes.star_rating >= 7 && selectedMods.includes('NC')
      }`
    )
    console.log(
      `validar EZ and * > 6: : ${map.attributes.star_rating > 6 && selectedMods.includes('EZ')
      }`
    )

    console.log(
      `Validar HR/HDHR and * > 7: ${map.attributes.star_rating >= 7 && selectedMods.includes('HR')
      }`
    )

    console.log(
      `Validar FL: ${map.attributes.star_rating >= 5 && selectedMods.includes('FL')
      }`
    )

    console.log(
      `Validar FL and DT * > 3.7: ${map.attributes.star_rating >= 3.7 && selectedMods.includes('DT')
      }`
    )
    console.log(
      `Validar: FL and NC * > 3.7: ${map.attributes.star_rating >= 3.7 && selectedMods.includes('NC')
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

  if (map.attributes.star_rating < osuConfig.dailyMaps.minimumDifficulty) {
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

export default class MapasOsu extends Event_Builder<'ready'> {
  public static dailyMap: DailyMap
  private readonly userRepository: RepositoryObj['userRepository']
  private readonly mapasRepository: RepositoryObj['mapasRepository']
  private readonly playRepository: RepositoryObj['playRepository']

  constructor({ userRepository, mapasRepository, playRepository}: RepositoryObj) {
    super({ eventType: 'ready', type: 'on', name: 'daily-map' })
    this.userRepository = userRepository
    this.mapasRepository = mapasRepository
    this.playRepository = playRepository
  }

  public async event() {
    try {
      if (!MapasOsu.dailyMap) {
        const restartBot = await this.mapasRepository.getOldestMapId()
          
        if (!restartBot) {
          const mapaRandom = await this.generateDailyRandomMap()

          const currentDate = new Date()
          const day = currentDate.getDate()
          const month = currentDate.getMonth() + 1
          const year = currentDate.getFullYear()

          await this.mapasRepository.create({
            oldMaps: mapaRandom.id,
            oldMapMods: JSON.stringify(mapaRandom.mods),
            oldMapMinRank: mapaRandom.minRank,
            mapName: mapaRandom.name,
            date: `${day}/${month.toString().padStart(2, '0')}/${year}`,
            picUrl: mapaRandom.picUrl
          })
          MapasOsu.dailyMap = mapaRandom
        } else {
          const mapa = await this.mapasRepository.getById(restartBot)

          MapasOsu.dailyMap = {
            id: mapa!.oldMaps,
            mods: JSON.parse(
              mapa!.oldMapMods
            ) as mods[],
            minRank: mapa!.oldMapMinRank as OsuRanks,
            name: mapa!.mapName,
            picUrl: mapa!.picUrl,
          }
        }
      }

      MapasOsu.triggerAt5AM(async () => {
        await this.savePlays()
        await this.getDailyMap()
      })
    } catch (error) {
      console.log(error)
    }
  }

  private async generateDailyRandomMap(): Promise<DailyMap> {
  try {
    const selectedMods: mods[] = generateDifficulty()

    const map = await getMapaRandom(selectedMods)

    const osuRanks = getRandomDifficulty()

    const dailyMap: DailyMap = {
      id: map.id,
      mods: selectedMods,
      minRank: osuRanks,
      name: map.beatmapset.title,
      picUrl: map.beatmapset.covers.list,
    } as DailyMap

    const mapInDb = await this.mapasRepository.getById(map.id)

    if (mapInDb) return await this.generateDailyRandomMap()

    return dailyMap
  } catch (error) {
    console.log(error)
    return await this.generateDailyRandomMap()
  }
}

  public static triggerAt5AM(callback: () => Promise<void>) {
    try {
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log('Error rescheduling')
    }
  }

  public async getDailyMap() {
    const mapaRandom = await this.generateDailyMap()
    const currentDate = new Date()
    const day = currentDate.getDate()
    const month = currentDate.getMonth() + 1
    const year = currentDate.getFullYear()

    await this.mapasRepository.create({
      oldMaps: mapaRandom.id,
      oldMapMods: JSON.stringify(mapaRandom.mods),
      oldMapMinRank: mapaRandom.minRank,
      mapName: mapaRandom.name,
      date: `${day}/${month.toString().padStart(2, '0')}/${year}`,
      picUrl: mapaRandom.picUrl
    })
    MapasOsu.dailyMap = mapaRandom
  }

  public async generateDailyMap(): Promise<DailyMap> {
    const mapaRandom = await this.generateDailyRandomMap()

    return {
      id:  mapaRandom.id,
      mods: mapaRandom.mods,
      minRank: mapaRandom.minRank,
      name: mapaRandom.name,
      picUrl: mapaRandom.picUrl,
    }
  }

  public async savePlays() {
    const map = await this.mapasRepository.getOldestMapId();
    if (!map) return
    const order = await this.playRepository.getPlayOrder(map)

    for (let i = 0; i < order.length; i++) {
      order[i].puntos += i

      await this.playRepository.addPointsToUserPlay(order[i].uId, order[i].puntos, order[i].mapId)
    }
  }
}