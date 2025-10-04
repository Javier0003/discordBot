import { CacheType, ChatInputCommandInteraction } from 'discord.js'
import Command from '../../builders/command-builder'
import { db } from '../../utils/db'
import { serverUsers } from '../../../drizzle/schemas/schema'
import { eq } from 'drizzle-orm'

export default class BanList extends Command {
  constructor() {
    super({
      name: 'banlist',
      description: 'Lista de usuarios baneados',
    })
  }

  public async command(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
    try{
      const banList = await db.select().from(serverUsers).where(eq(serverUsers.isVCBan, '1'))
      if (banList.length === 0) {
        this.embed.setDescription('No hay usuarios baneados')
        await interaction.reply({ embeds: [this.embed] })
        return
      }
  
      this.embed.setDescription('Lista de usuarios baneados')
      this.embed.addFields({ name: `Nombre:`, value: "\n" })
  
      for (const user of banList) {
        this.embed.addFields({ name: "\n", value: `<@${user.idServerUser}>`})
      }
  
      await interaction.reply({ embeds: [this.embed], allowedMentions: { parse: ['users'] } })
    }catch (error) {
      console.error('Error al obtener la lista de baneados:', error)
      this.embed.setDescription('Hubo un error al obtener la lista de baneados')
      await interaction.reply({ embeds: [this.embed] })
    }
  }
}