import 'dotenv/config'

const token = process.env.BOT_TOKEN as string
const guildId = process.env.GUILD_ID as string
const mcIp = process.env.MC_IP as string
const mcPort = process.env.MC_PORT as string
const mcPortOpener = Number(process.env.OPENER_PORT) as number
const dbUrl = process.env.DATABASE_URL as string

if(!dbUrl) throw new Error('No database URL provided')
if (!token) throw new Error('No token provided')
if (!guildId) throw new Error('No guild ID provided')

export default {
  token: token,
  guildId: guildId,
  mcIp: mcIp,
  mcPort: mcPort,
  mcPortOpener: mcPortOpener,
  dbUrl: dbUrl
}
