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
`

const buttonDateStyles = css`
  display: flex;
  flex-direction: row;
  width: fit-content;
  align-items: center;
  gap: 20px;

  button {
    background-color: #f0f0f0;
    border: 1px solid #000;
    border-radius: 8px;
    height: 30px;
    padding: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #e0e0e0;
  }
`

type MapasWithPlays = {
  playCount: string
  mapas: Mapas
}

export const MapComponent: FC<MapasWithPlays> = (map) => (
  <form action={`/mapa/${map.mapas.oldMaps}`} method="get" class={mapStyle}>
    <h2>{map.mapas.mapName}</h2>

    <p>Lo jugaron: {map.playCount}</p>

    <div class={buttonDateStyles}>
      <p>{map.mapas.date}</p>

      <button>Ir al mapa</button>
    </div>
  </form>
)
