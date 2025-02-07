import { css } from 'hono/css'
import { FC } from 'hono/jsx'
import env from '../../../env'
import { Context } from 'hono'

const headerStyles = css`
  background-color: #333;
  color: white;
  text-align: center;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const linkStyles = css`
  color: white;
  text-decoration: none;
`

const userStyles = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: fit-content;
  justify-content: flex-end;
  padding: 10px;
  font-size: 1.5rem;

  img {
    border-radius: 50%;
    width: 30%;

    @media (max-width: 768px) {
      width: 50%;
    }
  }
`

export const Header: FC<{ context?: Context }> = ({ context }) => {
  return (
    <header class={headerStyles}>
      <h1>
        <a href="/" class={linkStyles}>
          LoA
        </a>
      </h1>

      {!context?.userData ? (
        <a href={env.discord.redirectUri}>
          <button>LogIn</button>
        </a>
      ) : (
        <div class={userStyles}>
          {context?.userData.username}
          <img
            src={`https://cdn.discordapp.com/avatars/${context?.userData.id}/${context?.userData.avatar}.webp?size=96`}
            alt=""
          />
        </div>
      )}
    </header>
  )
}
