import 'dotenv/config'

const token = process.env.TOKEN as string
const guildId = process.env.GUILD_ID as string

if (!token) throw new Error('No token provided')
if (!guildId) throw new Error('No guild ID provided')

export default {
  token: token,
  guildId: guildId
}
