import { FC, Fragment } from 'hono/jsx'
import { css } from 'hono/css'
import { Context } from 'hono'
import MapData from './components/map-data'
import PlayerListComponent from './components/player-list'
import CommentSection from './components/comments/comment-section'
import getOsuToken from '../../../../utils/osu-token'
import { Header } from '../../components/header'
import Comment from './components/comments/comment'
import { PlayerComponent } from './components/player'

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
  const { commentRepository, playRepository, userRepository, mapasRepository } = context.repositories
  const id = context.req.param('id')
  const token = await getOsuToken()
  const comments = await commentRepository.getByMapId(Number(id))

  const commentPromise = await Promise.all(
    comments.map(async (comment) => <Comment comment={comment} key={comment.commentId}/>)
  )

  const playList = await playRepository.getByMapId(Number(id))
  const userData = await userRepository.getByIdList(playList.map(play => play.uId))


  const modData = await mapasRepository.getById(Number(id))


  return (
    <Fragment>
      <Header context={context} />
      <div class={bodyStyle}>
        <section class={mapAndPlayData}>

          <MapData mapId={id} token={token} mods={modData!.oldMapMods} date={modData!.date} />

          <PlayerListComponent>
            {playList.map((play, index) => {
              const user = userData.find(user => user.id === play.uId)
              return <PlayerComponent index={index} score={play.score} accuracy={Number(play.accuracy)} rank={play.rank} pp={play.pp} combo={play.combo} name={user?.name || "Unknown"} key={play.playId} />
            })}
          </PlayerListComponent>
        </section>

        <CommentSection mapId={id}>
          {commentPromise}
        </CommentSection>
      </div>
    </Fragment>
  )
}

export default Mapa
