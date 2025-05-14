import LoaClient from '../structures/loa-client'

export default async function appCommands(guildId: string) {
  try {
    const guild = await LoaClient.LoA.guilds.fetch(guildId)
    return guild.commands
  } catch (error) {
    console.log(error)
  }
}