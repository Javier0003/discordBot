import { Context } from "hono"
import { FC, Fragment } from "hono/jsx"
import { db } from "../../../utils/db"
import { and, eq } from "drizzle-orm"
import { serverUsers, Users, users } from "../../../../drizzle/schemas/schema"
import { Header } from "../components/header"
import Redirect from "../components/redirect"
import Script from "../components/Script"
import { getSomeUserData } from "../../backend/utils/discord"
import { css } from "hono/css"
import Link from "../components/Link"

async function getPaginatedUsers(page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;
    return db
        .select()
        .from(users)
        .leftJoin(serverUsers, eq(users.id, serverUsers.idServerUser))
        .offset(offset)
        .limit(pageSize);
}

type PaginatedUsers = Awaited<ReturnType<typeof getPaginatedUsers>>

async function getUsersWithData(users: PaginatedUsers) {
    const userData = await Promise.all(users.map(user => getSomeUserData(user?.users.id ?? "")));
    return users.map((user, index) => ({
        ...user,
        ...userData[index]
    }));
}

const cardStyles = css`
    border: 1px solid #ccc;
    border-radius: 12px;
    padding: 12px;
    width: fit-content;
    color: #ccc;

    display: flex;
    flex-direction: row;
    gap: 12px;

    img{
        height: 100%;
    }


    section {
        min-width: 150px;
        display: flex;
        flex-direction: column;
        h3 {
            margin: 0;
        }
    }

    .user-info {
        justify-content: flex-end;
        gap: 24px;
        padding-bottom: 8px;
    }


    .user-actions {
        justify-content: flex-end;
        gap: 12px;

        button {
            border-radius: 12px;
            padding: 8px 12px;
            background: transparent;
            border: 1px solid #ccc;
            color: #ccc;

            &:hover {
                background: #f0f0f0;
            }
        }
    }
`

const container = css`
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

const pageContainer = css`
  min-height: 100vh;
  background-color: rgb(25, 25, 25);
  display: flex;
  flex-direction: column;
`

const User: FC<{ context: Context }> = async ({ context }) => {
    const [dev] = await db.select().from(serverUsers).where(and(eq(serverUsers.idServerUser, context.userData.id), eq(serverUsers.isDev, '1')))
    if (!dev) {
        return <Redirect to='/' />
    }
    const page = Number((context.req.query() as { page?: number }).page) || 1
    const users = await getPaginatedUsers(page, 10)
    const usersWithData = await getUsersWithData(users)

    return (
        <div class={pageContainer}>
            <Header context={context} />
            <div id="container" className={container}>
                {usersWithData.map(user => {
                    if (user.id === context.userData.id) return null;

                    return (
                        <div key={user.users.id} id={`${user.users.id}-user-card`} className={cardStyles}>
                            <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?`} alt={`${user.users.name}'s avatar`} />
                            <section className="user-info">
                                <h3>{user.users.name}</h3>
                                <h3>{user.serverUsers?.isDev == "1" ? 'Developer' : 'User'}</h3>
                                <h3>{user.serverUsers?.isVCBan == "1" ? 'VC Banned' : 'Not VC Banned'}</h3>
                            </section>
                            <section id="toggle-container" className="user-actions">
                                <button className="toggle-role-button" data-user-id={user.users.id} data-is-dev={user.serverUsers?.isDev}>
                                    {user.serverUsers?.isDev == "1" ? 'Make User' : 'Make Developer'}
                                </button>
                                <button className="toggle-vcban-button" data-user-id={user.users.id} data-is-vcban={user.serverUsers?.isVCBan}>
                                    {user.serverUsers?.isVCBan == "1" ? 'Unban from VC' : 'Ban from VC'}
                                </button>
                            </section>
                        </div>
                    )
                })}
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
                <Link to={`/user?page=${page - 1}`}>
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
                <Link to={`/user?page=${page + 1}`}>
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

            <Script src={"static/scripts/user.js"} />
        </div>
    )
}

export default User;