import { FC } from 'hono/jsx'
import CommentBox from './comment-box'

const CommentSection: FC<{ mapId: string, children: unknown }> = async ({ mapId, children }) => {
  return (
    <section>
      <CommentBox mapId={mapId} />

      <h3 style={`color: white`}>Comentarios</h3>
      {children}
    </section>
  )
}

export default CommentSection
