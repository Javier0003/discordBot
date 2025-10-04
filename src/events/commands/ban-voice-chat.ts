import { CacheType, ChatInputCommandInteraction, MessageFlags } from 'discord.js'
import Command from '../../builders/command-builder'
import OptionBuilder from '../../builders/option-builder'
import { db } from '../../utils/db'
import { serverUsers, users } from '../../../drizzle/schemas/schema'
import { eq } from 'drizzle-orm'

const options = new OptionBuilder()
  .addUserOption({ description: 'User to ban', name: 'user', required: true })
  .build()

export default class BanVoiceChat extends Command<typeof options> {
  constructor() {
    super({
      name: 'ban-voice-chat',
      description: 'Ban a user from the voice chat',
      devOnly: true,
      testOnly: false,
      options: options,
      deleted: false,
      notUpdated: false
    })
  }

  public async command(interaction: ChatInputCommandInteraction<CacheType>) {
    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral })

      const user = interaction.options.getUser('user', true)
      const guild = interaction.guild
      if (!guild) return

      const member = await guild.members.fetch(user.id)
      if (!member) return

      const isUserRegistered = await db.select().from(serverUsers).where(eq(serverUsers.idServerUser, user.id))

      if (isUserRegistered.length === 0) {
        const isUserInActualUserDb = await db.select().from(users).where(eq(users.id, user.id))
        if(isUserInActualUserDb.length === 0){
          await db.insert(users).values({ id: user.id, name: user.username, osuId: 0 })
        }

        await db.insert(serverUsers).values({ idServerUser: user.id, isVCBan: '1' })
        await interaction.editReply({ content: `User ${user.username} has been banned from the voice chat` })
        return
      }
      
      if (isUserRegistered[0].isVCBan === '1') {
        await interaction.editReply({ content: 'User is already banned from the voice chat' })
        return
      }

      await db.update(serverUsers).set({ isVCBan: '1' }).where(eq(serverUsers.idServerUser, user.id))
      await interaction.editReply({ content: `User ${user.username} has been banned from the voice chat` })
    } catch (error) {
      console.log(error)
      await interaction.editReply({ content: 'An error occurred while banning the user from the voice chat' })
    }
  }
}