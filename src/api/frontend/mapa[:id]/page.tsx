import { FC, Fragment } from 'hono/jsx'
import getOsuToken from '../../../utils/osu-token'
import { css } from 'hono/css'
import { Context } from 'hono'
import { Header } from '../components/header'
import MapData from './components/map-data'
import PlayerListComponent from './components/player-list'
import CommentSection from './components/comments/comment-section'

const bodyStyle = css`
  padding: 20px;
  background-color: rgb(25, 25, 25);
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px;

  section {
    width: 50%;
  }
`

const mapAndPlayData = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Mapa: FC<{ context: Context }> = async ({ context }) => {
  const id = context.req.param('id')

  const token = await getOsuToken()

  return (
    <Fragment>
      <Header context={context} />
      <div class={bodyStyle}>
        <section class={mapAndPlayData}>
          <MapData mapId={id} token={token} />
          <PlayerListComponent id={id} />
        </section>

        <CommentSection mapId={id}/>
      </div>
    </Fragment>
  )
}

export default Mapa
