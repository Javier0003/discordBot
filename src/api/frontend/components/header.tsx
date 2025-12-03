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

const logInStyles = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: fit-content;
  justify-content: flex-end;
  padding: 10px;
  font-size: 1.5rem;

  button {
    background-color:rgb(58, 58, 58);
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    border: 1px solid black;
  }

  button:hover {
    background-color: rgb(80, 80, 80);
    border: 1px solid white;
    transition: 0.5s;
  }
`

export const Header: FC<{ context?: Context, children?: unknown }> = ({ context, children }) => {
  return (
    <header class={headerStyles}>
      <h1>
        <a href="/" class={linkStyles}>
          LoA
        </a>
      </h1>

      {children}

      {!context?.userData ? (
        <div class={logInStyles}>
          <a href={env.discord.redirectUri}>
            <button>LogIn</button>
          </a>
        </div>
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
