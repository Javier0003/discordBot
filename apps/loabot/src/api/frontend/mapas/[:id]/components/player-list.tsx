import { FC } from 'hono/jsx'
import { css } from 'hono/css'

const playListStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`

const PlayerListComponent: FC<{children: unknown}> = async ({ children }) => {
  return (
    <section class={playListStyle}>
      {children}
    </section>
  )
}

export default PlayerListComponent
