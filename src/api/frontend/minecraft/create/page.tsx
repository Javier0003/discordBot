import { Context } from "hono";
import { FC } from "hono/jsx";
import { Header } from "../../components/header";
import { css } from "hono/css";
import Redirect from "../../components/redirect";
import Script from "../../components/Script";

const pageContainer = css`
  min-height: 100vh;
  background-color: rgb(25, 25, 25);
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`

const createFromContainer = css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 32px;
    padding: 16px;
    border: 1px solid #444;
    border-radius: 8px;
    background-color: rgb(35, 35, 35);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

    input {
        padding: 8px;
        border-radius: 6px;
        border: 1px solid #666;
        background-color: #222;
        color: #ccc;
        width: 300px;
        box-sizing: border-box;
    }

    input:focus {
        outline: none;
        border-color: #888;
    }

    button {
        padding: 8px;
        border-radius: 6px;
        border: 1px solid #666;
        background-color: #222;
        color: #ccc;
        width: 150px;
        box-sizing: border-box;
        margin-top: 16px;
    }

    button:hover {
        background-color: #333;
    }
`

const MinecraftPage: FC<{ context: Context }> = async ({ context }) => {
    const { minecraftServersRepository, serverUsersRepository } = context.repositories;

    const dev = await serverUsersRepository.getById(context.userData.id);

    if (!dev?.isDev) {
        return <Redirect to="/" />
    }

    const minecraftServers = await minecraftServersRepository?.getPaged(1, 10);

    return (
        <div className={pageContainer}>
            <Header context={context} />

            <div className={createFromContainer}>
                <h1>Create a Minecraft Server</h1>
                <label htmlFor="">Nombre:</label>

                <input type="text" id="nameInput" />

                <label htmlFor="">IP:</label>

                <input type="text" id="ipInput" />

                <label htmlFor="">Port:</label>

                <input type="text" id="portInput"/>

                <button id="send">Create Server</button>
            </div>

            <Script src="static/scripts/minecraft-server/create.js" />
        </div>
    );
}


export default MinecraftPage;