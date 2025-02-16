import { FC } from 'hono/jsx'
import { plays, users } from '../../../../../drizzle/schemas/schema'
import { db } from '../../../../utils/db'
import { desc, eq } from 'drizzle-orm'
import { css } from 'hono/css'
import addPointToNumbers from '../../../../utils/add-point-to-numbers'
import OsuDaily from '../../../../events/commands/osu-daily'

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

const PlayerListComponent: FC<{id: string}> = async ({ id }) => {
  const playList = await db
    .select()
    .from(plays)
    .where(eq(plays.mapId, Number(id)))
    .orderBy(desc(plays.score))

  const userData = await db.select().from(users)

  return (
    <section class={playListStyle}>
      {playList.map((play, index) => (
        <div class={playStyle} key={index}>
          <span>#{index + 1}</span>
          <span>Nombre: {userData.find((u) => u.id === play.uId)?.name}</span>
          <span>Rank: {play.rank}</span>
          <span>Score: {addPointToNumbers(play.score)}</span>
          <span>Accuracy: {OsuDaily.accuracy(Number(play.accuracy))}%</span>
          <span>PP: {play.pp}pp</span>
          <span>Combo: {play.combo}x</span>
        </div>
      ))}
    </section>
  )
}

export default PlayerListComponent
