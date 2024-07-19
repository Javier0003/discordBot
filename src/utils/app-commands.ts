import LoaClient from '../structures/loa-client'

export default async function appCommands(guildId: string) {
  const guild = await LoaClient.LoA.guilds.fetch(guildId)
  return guild.commands
}