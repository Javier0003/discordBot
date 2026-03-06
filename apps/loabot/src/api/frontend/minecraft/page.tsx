import { css } from "hono/css";
import { FC } from "hono/jsx";
import { Header } from "../components/header";
import { Context } from "hono";
import Link from "../components/Link";
import { linkStyles } from "../constants/styles";
import { statusJava } from "node-mcstatus";

const pageContainer = css`
  min-height: 100vh;
  background-color: rgb(25, 25, 25);
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`

const registerServersContainer = css`
    position: absolute;
    border: 1px solid #444;
    border-radius: 8px;
    padding: 8px;
    background-color: rgb(35, 35, 35);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    bottom: 16px;
    right: 16px;

    button {
        padding: 8px;
        border-radius: 6px;
        border: 1px solid #666;
        background-color: #222;
        color: #ccc;
        width: 200px;
        box-sizing: border-box;
    }

    button:hover {
        background-color: #333;
    }
`

const serverCard = css`
    border: 1px solid #444;
    border-radius: 8px;
    padding: 16px;
    margin: 16px;
    background-color: rgb(35, 35, 35);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: fit-content;

    h2 {
        margin: 0 0 8px 0;
        color: #eee;
    }

    p {
        margin: 4px 0;
        color: #ccc;
    }

    img {
        margin-top: 8px;
        width: 64px;
        height: 64px;
    }`

const MinecraftPage: FC<{ context: Context }> = async ({ context }) => {
    const { minecraftServersRepository, serverUsersRepository } = context.repositories;
    const dev = await serverUsersRepository.getById(context.userData.id);;

    const minecraftServers = await minecraftServersRepository?.getPaged(1, 10);
    
    const serverDataList = await Promise.all(
        minecraftServers?.map(async (server) => {
            const status = await statusJava(server.ip, server.port);
            return {
                ...server,
                status,
            };
        }) || []
    );


    return (
        <div className={pageContainer}>
            <Header context={context} />
            {serverDataList?.map((server) => (
                <div key={server.idServer} className={serverCard}>
                    <h2>{server.name}</h2>
                    <p>IP: {server.ip}</p>
                    <p>Port: {server.port}</p>
                    <img src={server.status.icon ? `data:image/png;base64,${server.status.icon.split(',')[1]}` : ''} alt="Server Icon" />
                </div>
            ))}


            {dev?.isDev && (
                <div className={registerServersContainer}>
                    <Link to="/minecraft/create" className={linkStyles}>¿No ves tu servidor?</Link>
                </div>
            )}
        </div>
    );
}


export default MinecraftPage;