import { FC, Fragment } from 'hono/jsx'
import { css } from 'hono/css'
import { Header } from './components/header'
import { Context } from 'hono'

const header = css`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

const Home: FC<{ context: Context }> = async ({ context }) => {
  
  return (
    <Fragment>
      <Header context={context} />

      <div class={header}>
        <h1>Home</h1>

        <a href="/mapas">Home page</a>
      </div>
    </Fragment>
  )
}

export default Home
