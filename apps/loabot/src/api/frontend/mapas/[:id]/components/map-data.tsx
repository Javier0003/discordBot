import { css } from 'hono/css'
import { FC } from 'hono/jsx'
import getOsuMap from '../../../../../utils/get-osu-map'

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

const MapData: FC<{mapId: string, token: string, mods: string, date: string}> = async ({mapId, token, mods, date}) => {
  const mapData = await getOsuMap(Number(mapId), token)
    
  return (
    <section class={mapStyle}>
      <div class={mapInfoStyle}>
        <h1>{`${mapData.beatmapset.title}[${mapData.version}]`}</h1>
        <p>{`Difficulty: ${mapData.difficulty_rating}⭐`}</p>
        <p>{`Mods: ${JSON.parse(mods)}`}</p>
        <p>{`Combo: ${mapData.max_combo}x`}</p>
        <p>{`Ar: ${mapData.ar}`}</p>
        <p>{`CS: ${mapData.cs}`}</p>
        <p>{`Dia: ${date}`}</p>
      </div>
      <img src={`${mapData.beatmapset.covers.list}`} alt="" />
    </section>
  )
}

export default MapData
