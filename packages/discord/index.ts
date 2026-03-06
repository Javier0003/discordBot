import { BOT_TOKEN } from "./env";


export async function getSomeUserData(id: string) {
    const res = await fetch(`https://discord.com/api/users/${id}`, {
        headers: {
            Authorization: `Bot ${BOT_TOKEN}`,
        }
    })
    if (!res.ok) return null

    return await res.json() as UserData
}


export interface UserData {
    id: string
    username: string
    avatar: string
    discriminator: string
    public_flags: number
    flags: number
    banner: string
    accent_color: number
    global_name: string
    avatar_decoration_data: null
    banner_color: string
    clan: null
    primary_guild: null
    mfa_enabled: boolean
    locale: string
    premium_type: number
}
