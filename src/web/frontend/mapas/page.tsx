import { FC } from 'hono/jsx'
import { css } from 'hono/css'
import { db } from '../../../utils/db'
import { Mapas, mapas, plays } from '../../../../drizzle/schemas/schema'
import { MapComponent } from './components/map-component'
import { Header } from '../components/header'
import { desc, eq, sql } from 'drizzle-orm'
import Link from '../components/Link'

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

const todayMapStyle = css`
  background-color: rgb(0, 0, 0);
  padding: 20px;
  border-radius: 10px;
  width: 50%;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  img {
    border-radius: 8px;
  }

  @media (max-width: 1280px) {
    width: 100%;
  }
`

async function GetPaginatedMaps(page: number, pageSize: number) {
  const offset = (page - 1) * pageSize;
  return db
    .select({ mapas, playCount: sql<string>`COUNT(${plays.mapId})` })
    .from(mapas)
    .leftJoin(plays, eq(mapas.oldMaps, plays.mapId))
    .groupBy(mapas.oldMaps)
    .orderBy(desc(mapas.order))
    .offset(offset)
    .limit(pageSize);
}

const Mapas: FC = async ({ context }) => {
  const page = Number((context.req.query() as { page?: number }).page) || 1

  console.log('Page:', page)
  
  const mapList = await GetPaginatedMaps(page, 10)


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
