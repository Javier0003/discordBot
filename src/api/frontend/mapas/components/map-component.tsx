import { css } from 'hono/css'
import { FC } from 'hono/jsx'
import { Mapas } from '../../../../../drizzle/schemas/schema'

const mapStyle = css`
  width: fit-content;
  min-width: 200px;
  flex-grow: 1;
  background-color: rgb(233, 233, 233);
  border-radius: 12px;
  padding: 20px;
  height: fit-content;
  display: flex;
  flex-direction: row;
  gap: 20px
`

const buttonDateStyles = css`
  display: flex;
  flex-direction: row;
  min-width: 250px;
  width: 100%;
  align-items: center;
  gap: 20px;
  justify-content: space-between;

  button {
    background-color: #f0f0f0;
    border-radius: 8px;
    height: 30px;
    padding: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #e0e0e0;
  }
`

const mapDataStyles = css`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

type MapasWithPlays = {
  playCount: string
  mapas: Mapas
}

export const MapComponent: FC<MapasWithPlays> = (map) => (
  <form action={`/mapa/${map.mapas.oldMaps}`} method="get" class={mapStyle}>
    <img src={map.mapas.picUrl} alt={map.mapas.mapName} />
    <div class={mapDataStyles}>
      <h2>{map.mapas.mapName}</h2>

      <p>Lo jugaron: {map.playCount}</p>

      <div class={buttonDateStyles}>
        <p>{map.mapas.date}</p>

        <button>Ir al mapa</button>
      </div>
    </div>
  </form>
)
