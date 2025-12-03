import { FC, Fragment } from 'hono/jsx'
import { Header } from './components/header'
import { Context } from 'hono'
import Link from './components/Link'
import { container, linkStyles } from './constants/styles'


const Home: FC<{ context: Context }> = async ({ context }) => {
  const authenticated = context.userData?.id !== undefined;

  let dev;

  if (authenticated) {
    dev = await context.repositories.serverUsersRepository.getById(context.userData.id);
  }

  console.log('dev', dev);

  return (
    <Fragment>
      <Header context={context} />
      <div class={container}>
        <Link to="/mapas" className={linkStyles}>
          Mapas Diarios
          <img src="/static/osu.svg" />
        </Link>
        <Link to="/dbd" className={linkStyles}>
          Dead by Daylight
          <img src="/static/imgs/dbd/dbd-logo.jpg" />
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
