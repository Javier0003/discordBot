import 'dotenv/config'

const {
  OSU_CLIENT_ID,
  BOT_TOKEN,
  GUILD_ID,
  MC_IP,
  MC_PORT,
  OPENER_PORT,
  DATABASE_URL,
  OSU_BODY,
  DEV1,
  DEV2,
  CLIENT_SECRET_DISCORD,
  CLIENT_ID_DISCORD,
  REDIRECT_URI,
  DOMAIN,
  OSU_API_KEY,
  MIGRATOR_URL
} = process.env

if (!REDIRECT_URI) throw new Error('No redirect uri provided')
if (!CLIENT_SECRET_DISCORD) throw new Error('No Discord client secret provided')
if (!CLIENT_ID_DISCORD) throw new Error('No Discord client ID provided')
if (!MC_IP) throw new Error('No Minecraft IP provided')
if (!MC_PORT) throw new Error('No Minecraft port provided')
if (!OPENER_PORT) throw new Error('No Opener port provided')
if (!OSU_BODY) throw new Error('No osu! body provided')
if (!DATABASE_URL) throw new Error('No database URL provided')
if (!BOT_TOKEN) throw new Error('No token provided')
if (!GUILD_ID) throw new Error('No guild ID provided')
if (!OSU_CLIENT_ID) throw new Error('No osu! client ID provided')
if (!OSU_API_KEY) throw new Error('No osu! API key provided')

export default {
  token: BOT_TOKEN,
  guildId: GUILD_ID,
  mcIp: MC_IP,
  mcPort: Number(MC_PORT),
  mcPortOpener: Number(OPENER_PORT),
  dbUrl: DATABASE_URL,
  migrateUrl: MIGRATOR_URL,
  osu: {
    osuBody: OSU_BODY,
    clientId: Number(OSU_CLIENT_ID),
    apiKey: OSU_API_KEY,
  } as const,
  dev: [DEV1, DEV2],
  discord: {
    clientId: CLIENT_ID_DISCORD,
    clientSecret: CLIENT_SECRET_DISCORD,
    redirectUri: REDIRECT_URI,
  } as const,
  DOMAIN,
} as const
