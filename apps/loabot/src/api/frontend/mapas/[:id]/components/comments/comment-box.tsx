import { css } from 'hono/css'
import { FC } from 'hono/jsx'

const container = css`
  display: flex;
  flex-direction: row;
  gap: 10px;

  button {
    background-color: rgb(25, 25, 25);
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: 0.5s;
  }

  button:hover {
    background-color: rgb(50, 50, 50);
    border: 1px solid white;
  }

  textarea {
    resize: none;
    width: 50%;
    height: 50px;
    border: 1px solid white;
    border-radius: 5px;
    overflow: auto;
  }
`

const CommentBox: FC<{ mapId: string }> = ({ mapId }) => (
  <form action={`/api/comment/upload/${mapId}`} method="post" class={container}>
    <textarea name="comment" placeholder='Deja tu comentario aqui...'/>
    <button type="submit">Submit</button>
  </form>
)

export default CommentBox
