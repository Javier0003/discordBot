import { FC, Fragment } from 'hono/jsx'
import { db } from '../../../utils/db'
import { mapas, plays, users } from '../../../../drizzle/schemas/schema'
import { desc, eq } from 'drizzle-orm'
import getOsuMap from '../../../utils/get-osu-map'
import getOsuToken from '../../../utils/osu-token'
import OsuDaily from '../../../events/commands/osu-daily'
import { css } from 'hono/css'
import addPointToNumbers from '../../../utils/add-point-to-numbers'
import { Context } from 'hono'
import { Header } from '../components/header'

const playStyle = css`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  padding: 10px;
  width: fit-content;
  background-color: rgb(255, 255, 255);
  border-radius: 8px;
`

const playListStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`

const bodyStyle = css`
  padding: 20px;
  background-color: rgb(25, 25, 25);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

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

const Mapa: FC<{ context: Context }> = async ({ context }) => {
  const id = context.req.param('id')

  const playList = await db
    .select()
    .from(plays)
    .where(eq(plays.mapId, Number(id)))
    .orderBy(desc(plays.score))
  const token = await getOsuToken()
  const mapData = await getOsuMap(Number(id), token)
  const userData = await db.select().from(users)
  const [modData] = await db
    .select({ mods: mapas.oldMapMods, date: mapas.date })
    .from(mapas)
    .where(eq(mapas.oldMaps, Number(id)))

  

  return (
    <Fragment>
      <Header context={context} />
      <div class={bodyStyle}>
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

        <section class={playListStyle}>
          {playList.map((play, index) => (
            <div class={playStyle} key={index}>
              <span>#{index + 1}</span>
              <span>
                Nombre: {userData.find((u) => u.id === play.uId)?.name}
              </span>
              <span>Rank: {play.rank}</span>
              <span>Score: {addPointToNumbers(play.score)}</span>
              <span>Accuracy: {OsuDaily.accuracy(Number(play.accuracy))}%</span>
              <span>PP: {play.pp}pp</span>
              <span>Combo: {play.combo}x</span>
            </div>
          ))}
        </section>
      </div>
    </Fragment>
  )
}

export default Mapa
