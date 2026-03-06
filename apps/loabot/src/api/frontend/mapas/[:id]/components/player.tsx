import { css } from "hono/css"
import { FC } from "hono/jsx"
import addPointToNumbers from "../../../../../utils/add-point-to-numbers"
import OsuDaily from "../../../../../events/commands/osu-daily"

const playStyle = css`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  padding: 10px;
  width: fit-content;
  background-color: rgb(255, 255, 255);
  border-radius: 8px;
`

export const PlayerComponent: FC<{ index: number, score: number, accuracy: number, rank: string, pp: number, combo: number, name: string }> = ({
    index,
    score,
    accuracy,
    rank,
    pp,
    combo,
    name
}) => {
    return (
        <div class={playStyle} key={index}>
            <span>#{index + 1}</span>
            <span>Nombre: {name}</span>
            <span>Rank: {rank}</span>
            <span>Score: {addPointToNumbers(score)}</span>
            <span>Accuracy: {OsuDaily.accuracy(Number(accuracy))}%</span>
            <span>PP: {pp}pp</span>
            <span>Combo: {combo}x</span>
        </div>
    )
}

