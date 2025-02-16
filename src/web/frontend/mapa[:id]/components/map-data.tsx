import { css } from 'hono/css'
import { FC } from 'hono/jsx'
import getOsuMap from '../../../../utils/get-osu-map'
import { mapas } from '../../../../../drizzle/schemas/schema'
import { db } from '../../../../utils/db'
import { eq } from 'drizzle-orm'

const mapStyle = css`
  display: flex;
  flex-direction: row;
  width: fit-content;
  gap: 20px;
  justify-content: space-between;
  border: 1px solid black;
  padding: 10px;
  background-color: rgb(0, 0, 0);
  border-radius: 8px;
  color: white;

  img {
    width: 200px;
  }
`
const mapInfoStyle = css`
  display: flex;
  flex-direction: column;

  p {
    margin: 0;
  }
`

const MapData: FC<{mapId: string, token: string}> = async ({mapId, token}) => {
  const mapData = await getOsuMap(Number(mapId), token)
  const [modData] = await db
    .select({ mods: mapas.oldMapMods, date: mapas.date })
    .from(mapas)
    .where(eq(mapas.oldMaps, Number(mapId)))
    
  return (
    <section class={mapStyle}>
      <div class={mapInfoStyle}>
        <h1>{`${mapData.beatmapset.title}[${mapData.version}]`}</h1>
        <p>{`Difficulty: ${mapData.difficulty_rating}⭐`}</p>
        <p>{`Mods: ${JSON.parse(modData.mods)}`}</p>
        <p>{`Combo: ${mapData.max_combo}x`}</p>
        <p>{`Ar: ${mapData.ar}`}</p>
        <p>{`CS: ${mapData.cs}`}</p>
        <p>{`Dia: ${modData.date}`}</p>
      </div>
      <img src={`${mapData.beatmapset.covers.list}`} alt="" />
    </section>
  )
}

export default MapData
