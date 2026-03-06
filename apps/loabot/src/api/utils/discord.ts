import env from '../../env'

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

export async function getUserData(token: string): Promise<UserData | null> {
  try {
    const userRes = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!userRes.ok) return null

    const userData = await userRes.json() as UserData

    return userData
  } catch (error) {
    console.log(error)
    return null
  }
}

export interface Guild {
  id: string
  name: string
  icon: null | string
  banner: null | string
  owner: boolean
  permissions: string
  features: string[]
}


export async function checkGuild(token: string): Promise<boolean> {
  try {
    const res = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) return false

    const data = await res.json() as Guild[]

    return data.some((guild: Guild) => guild.id === env.guildId)
  } catch (error) {
    console.log(`Error checking guild: ${error}`)
    return false
  }
}

export type DiscordTokenResponse = {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}

export async function createToken(code: string) {
  try {
    const formData = new URLSearchParams({
      client_id: env.discord.clientId,
      client_secret: env.discord.clientSecret,
      grant_type: 'authorization_code',
      code: code.toString(),
      redirect_uri: `${(env.DOMAIN || "http://localhost:42069").replace(/["'\s]+/g, '').replace(/\/$/, '')}/api/auth/discord/redirect`,
    })
  
    const res = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    })
  
    if (!res.ok) return null
  
    return await res.json() as DiscordTokenResponse
  } catch (error) {
    console.log(`Error creating token: ${error}`)
  }
  
}

export async function getSomeUserData(id: string) {
  const res = await fetch(`https://discord.com/api/users/${id}`, {
    headers: {
      Authorization: `Bot ${env.token}`,
    }
  })
  if (!res.ok) return null

  return await res.json() as UserData
}


export async function refreshToken(refresh_token: string): Promise<DiscordTokenResponse | null> {
  const formData = new URLSearchParams({
    client_id: env.discord.clientId,
    client_secret: env.discord.clientSecret,
    grant_type: 'refresh_token',
    refresh_token: refresh_token,
  })

  const res = await fetch('https://discord.com/api/v10/oauth2/token',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  })

  if(!res.ok) return null

  return await res.json() as DiscordTokenResponse
}