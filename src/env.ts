import 'dotenv/config'

const token = process.env.BOT_TOKEN as string
const guildId = process.env.GUILD_ID as string
const mcIp = process.env.MC_IP as string
const mcPort = process.env.MC_PORT as string
const mcPortOpener = Number(process.env.OPENER_PORT) as number
const dbUrl = process.env.DATABASE_URL as string
const osuBody = process.env.OSU_BODY as string
const dev1 = process.env.DEV1 as string
const dev2 = process.env.DEV2 as string

if(!dbUrl) throw new Error('No database URL provided')
if (!token) throw new Error('No token provided')
if (!guildId) throw new Error('No guild ID provided')

export default {
  token: token,
  guildId: guildId,
  mcIp: mcIp,
  mcPort: mcPort,
  mcPortOpener: mcPortOpener,
  dbUrl: dbUrl,
  osuBody: osuBody,
  dev: [dev1, dev2]
}
