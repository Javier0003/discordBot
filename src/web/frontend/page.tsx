import { FC, Fragment } from 'hono/jsx'
import { Header } from './components/header'
import { Context } from 'hono'
import Link from './components/Link'
import { db } from '../../utils/db'
import { serverUsers } from '../../../drizzle/schemas/schema'
import { and, eq } from 'drizzle-orm'
import { container, linkStyles } from './constants/styles'


const Home: FC<{ context: Context }> = async ({ context }) => {
  const authenticated = context.userData?.id !== undefined;

  let dev;

  if (authenticated) {
    dev = await db.select().from(serverUsers).where(and(eq(serverUsers.idServerUser, context.userData.id), eq(serverUsers.isDev, '1'))).limit(1).then(r => r.length > 0);
  }

  return (
    <Fragment>
      <Header context={context} />
      <div class={container}>
        <Link to="/mapas" className={linkStyles}>
          Mapas Diarios
          <img src="/static/osu.svg" />
        </Link>

        {dev && (
          <Fragment>
            <Link to="/user" className={linkStyles}>
              Users
            </Link>
            <Link to="/bot" className={linkStyles}>
              Bot
            </Link>
          </Fragment>
        )}
      </div>
    </Fragment>
  )
}

export default Home
