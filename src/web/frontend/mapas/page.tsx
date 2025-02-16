import { FC, Fragment } from 'hono/jsx'
import { css } from 'hono/css'
import { db } from '../../../utils/db'
import { Mapas, mapas, plays } from '../../../../drizzle/schemas/schema'
import { MapComponent } from './components/map-component'
import { Header } from '../components/header'
import getOsuToken from '../../../utils/osu-token'
import getOsuMap from '../../../utils/get-osu-map'
import { Beatmap } from '../../../utils/osu-daily.config'
import { eq, sql } from 'drizzle-orm'

const body = css`
  background-color: rgb(25, 25, 25);
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
  min-height: 100vh;
  align-content: flex-start;
`

const todayMapStyle = css`
  background-color: rgb(0, 0, 0);
  padding: 20px;
  border-radius: 10px;
  width: 50%;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  img {
    border-radius: 8px;
  }

  @media (max-width: 1280px) {
    width: 100%;
  }
`

type TodayMap = {
  mapa: Mapas
  mapData: Beatmap
}

const Mapas: FC = async ({ context }) => {
  const mapList = (
    await db
      .select({ mapas, playCount: sql<string>`COUNT(${plays.mapId})` })
      .from(mapas)
      .leftJoin(plays, eq(mapas.oldMaps, plays.mapId))
      .groupBy(mapas.oldMaps)
      .orderBy(mapas.order)
  ).reverse()

  const currentDate = new Date()
  const day = currentDate.getDate()
  const month = currentDate.getMonth() + 1
  const year = currentDate.getFullYear()

  let todayMap: TodayMap | undefined
  if (
    mapList[0].mapas.date ===
    `${day}/${month.toString().padStart(2, '0')}/${year}`
  ) {
    const mapa = mapList.shift()!
    const token = await getOsuToken()
    const mapData = await getOsuMap(Number(mapa.mapas.oldMaps), token)

    todayMap = {
      mapa: mapa.mapas,
      mapData
    }
  }

  return (
    <Fragment>
      <Header context={context} />
      <div class={body}>
        {todayMap && (
          <div class={todayMapStyle}>
            <div>
              <h1>
                Mapa de hoy:{' '}
                <a href={todayMap.mapData.url} style={'color: white'}>
                  {todayMap.mapa.mapName}
                </a>
              </h1>
              <h2>{todayMap.mapa.date}</h2>
              <p>{`Mods: ${JSON.parse(todayMap.mapa.oldMapMods)}`}</p>
              <p>{`Rank: ${todayMap.mapa.oldMapMinRank}`}</p>
            </div>
            <img
              src={todayMap.mapData.beatmapset.covers.list}
              style={'height: 100%'}
            />
          </div>
        )}
        {mapList.map(MapComponent)}
      </div>
    </Fragment>
  )
}

export default Mapas
