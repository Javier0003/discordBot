import 'dotenv/config'

const { BOT_TOKEN, GUILD_ID, MC_IP, MC_PORT, OPENER_PORT, DATABASE_URL, OSU_BODY, DEV1, DEV2, CLIENT_SECRET_DISCORD, CLIENT_ID_DISCORD, REDIRECT_URI } = process.env

if (!REDIRECT_URI) throw new Error('No dev1 ID provided')
if (!CLIENT_SECRET_DISCORD) throw new Error('No Discord client secret provided')
if (!CLIENT_ID_DISCORD) throw new Error('No Discord client ID provided')
if (!MC_IP) throw new Error('No Minecraft IP provided')
if (!MC_PORT) throw new Error('No Minecraft port provided')
if (!OPENER_PORT) throw new Error('No Opener port provided')
if (!OSU_BODY) throw new Error('No osu! body provided')
if (!DATABASE_URL) throw new Error('No database URL provided')
if (!BOT_TOKEN) throw new Error('No token provided')
if (!GUILD_ID) throw new Error('No guild ID provided')

export default {
  token: BOT_TOKEN,
  guildId: GUILD_ID,
  mcIp: MC_IP,
  mcPort: MC_PORT,
  mcPortOpener: Number(OPENER_PORT),
  dbUrl: DATABASE_URL,
  osuBody: OSU_BODY,
  dev: [DEV1, DEV2],
  discord: {
    clientId: CLIENT_ID_DISCORD,
    clientSecret: CLIENT_SECRET_DISCORD,
    redirectUri: REDIRECT_URI
  }
}
