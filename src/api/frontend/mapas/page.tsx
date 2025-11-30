import { FC } from 'hono/jsx'
import { css } from 'hono/css'
import { MapComponent } from './components/map-component'
import { Header } from '../components/header'
import Link from '../components/Link'
import { Context } from 'hono'

const pageContainer = css`
  min-height: 100vh;
  background-color: rgb(25, 25, 25);
  display: flex;
  flex-direction: column;
`

const body = css`
  flex: 1;
  display: flex;
  margin-top: 8px;
  margin-left: 12px;
  margin-right: 12px;
  flex-wrap: wrap;
  gap: 20px;
  align-content: flex-start;
  box-sizing: border-box;
`


const Mapas: FC<{ context: Context }> = async ({ context }) => {
  const { mapasRepository } = context.repositories
  const page = Number((context.req.query() as { page?: number }).page) || 1

  console.log('Page:', page)
  
  const mapList = await mapasRepository.getPagedMapsWithPlays((page - 1) * 10, 10)

  return (
      <div class={pageContainer}>
        <Header context={context} />
        
        <div class={body}>
          {mapList.map(MapComponent)}
        </div>


        <div
          style={`
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 24px 0 16px 0;
            background: linear-gradient(90deg, #232526 0%, #414345 100%);
            border-top: 1px solid #444;
            gap: 16px;
          `}
        >
          <Link to={`/mapas?page=${page - 1}`}>
            <button
              style={`
                padding: 10px 24px;
                background: #222;
                color: #fff;
                border: none;
                border-radius: 6px;
                font-size: 1rem;
                cursor: pointer;
                transition: background 0.2s;
              `}
              onMouseOver={e => (e.currentTarget.style.background = '#333')}
              onMouseOut={e => (e.currentTarget.style.background = '#222')}
              disabled={page <= 1}
            >
              Anterior
            </button>
          </Link>
          <span style="color: #bbb; font-size: 1rem;">Página {page}</span>
          <Link to={`/mapas?page=${page + 1}`}>
            <button
              style={`
                padding: 10px 24px;
                background: #222;
                color: #fff;
                border: none;
                border-radius: 6px;
                font-size: 1rem;
                cursor: pointer;
                transition: background 0.2s;
              `}
              onMouseOver={e => (e.currentTarget.style.background = '#333')}
              onMouseOut={e => (e.currentTarget.style.background = '#222')}
            >
              Siguiente
            </button>
          </Link>
        </div>
      </div>
  )
}

export default Mapas
