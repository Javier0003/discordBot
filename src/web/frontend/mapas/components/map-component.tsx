import { css } from 'hono/css'
import { FC } from 'hono/jsx'

const mapStyle = css`
  width: fit-content;
  min-width: 200px;
  flex-grow: 1;
  background-color:rgb(233, 233, 233);
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

export const MapComponent: FC = (map) => (
  <form action={`/mapa/${map.oldMaps}`} method="get" class={mapStyle}>
    <h2>{map.mapName}</h2>

    <div class={buttonDateStyles}>
      <p>{map.date}</p>

      <button>Ir al mapa</button>
    </div>
  </form>
)
