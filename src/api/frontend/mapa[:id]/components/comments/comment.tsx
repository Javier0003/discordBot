import { FC } from 'hono/jsx'
import { Comments } from '../../../../../../drizzle/schemas/schema'
import { getSomeUserData } from '../../../../backend/utils/discord'
import { css } from 'hono/css'

const commentStyle = css`
  display: flex;
  gap: 10px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 10px;
  background-color: rgb(50, 50, 50);

  img {
    border-radius: 50%;
    width: 50px;
    height: 50px;
  }

  p {
    color: white;
    margin: 0;
  }

  p:nth-child(3) {
    color: grey;
  }

  p:nth-child(2) {
    flex: 1;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
    white-space: normal;
  }

  p:nth-child(3) {
    width: fit-content;
    margin-left: auto;
  }
`

const Comment: FC<{ comment: Comments }> = async ({ comment }) => {
  const userData = await getSomeUserData(comment.uId)
  if (!userData) return <div>Usuario no encontrado</div>

  const date = new Date(comment.date)

  return (
    <div class={commentStyle}>
      <img
        src={`https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.webp?size=96`}
      />
      <div>
        <p>{userData.username}</p>
        <p>{comment.comment}</p>
      </div>
      <p>
        {`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`} <br />{' '}
        {`${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`}
      </p>
    </div>
  )
}

export default Comment
