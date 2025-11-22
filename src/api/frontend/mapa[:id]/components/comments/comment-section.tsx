import { FC } from 'hono/jsx'
import CommentBox from './comment-box'
import { db } from '../../../../../utils/db'
import { comments } from '../../../../../../drizzle/schemas/schema'
import { desc, eq } from 'drizzle-orm'
import Comment from './comment'

const CommentSection: FC<{ mapId: string }> = async ({ mapId }) => {
  const commentList = await db
    .select()
    .from(comments)
    .where(eq(comments.mapId, Number(mapId)))
    .orderBy(desc(comments.commentId))

  const commentPromise = await Promise.all(
    commentList.map(async (comment) => <Comment comment={comment} key={comment.commentId}/>)
  )

  return (
    <section>
      <CommentBox mapId={mapId} />

      <h3 style={`color: white`}>Comentarios</h3>
      {commentPromise}
    </section>
  )
}

export default CommentSection
