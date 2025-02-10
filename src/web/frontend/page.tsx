import { FC, Fragment } from 'hono/jsx'
import { css } from 'hono/css'
import { Header } from './components/header'
import { Context } from 'hono'
import Link from './components/Link'

const container = css`
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: rgb(25, 25, 25);
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
`
const linkStyles = css`
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  margin: 1rem;
  padding: 1rem;
  border: 1px solid white;
  border-radius: 0.5rem;
  transition: 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 3rem;
    height: 3rem;
  }

  &:hover {
    background-color: white;
    color: black;
  }
`

const Home: FC<{ context: Context }> = async ({ context }) => {
  return (
    <Fragment>
      <Header context={context} />
      <div class={container}>
        <Link to="/mapas" className={linkStyles}>
          Mapas Diarios
          <img src="/static/osu.svg"/>
        </Link>
      </div>
    </Fragment>
  )
}

export default Home
