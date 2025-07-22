import {
  CacheType,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  AttachmentBuilder,
  ChatInputCommandInteraction
} from 'discord.js'
import Command from '../../structures/command-builder'
import { Socket } from 'node:net'
import { statusJava } from 'node-mcstatus'
import env from '../../env'

export default class McStatus extends Command {
  constructor() {
    super({
      name: 'mcserver',
      description: 'Revisar el estado del server de minecraft',
      notUpdated: true
    })
  }
  public async command(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    try {
      const embed = new EmbedBuilder()
        .setTitle('Minecraft Server Status')
        .setDescription('Esperate un momento')
        .setTimestamp(new Date())

      const reply = await interaction.reply({
        embeds: [embed]
      })

      let players = '';
      const serverStatus = await statusJava(`${env.mcIp}`, env.mcPort);

      console.log(serverStatus)
      if (serverStatus.online) {
        if (serverStatus.players!.online > 0) {
          serverStatus.players?.list.map(({ name_raw }) => {
            players = players + `${name_raw}\n`
          })
        }
      }
      embed
        .setTitle('Minecraft Server Status')
        .setDescription(
          serverStatus.online ? serverStatus.motd?.clean ?? 'No MOTD' : 'Server is Offline'
        )
        .addFields({
          name: serverStatus.online
            ? `Players online: ${serverStatus.players!.online}`
            : ' ',
          value: players,
          inline: true
        })
        .setTimestamp(new Date())
        .setColor(serverStatus.online ? 'Green' : 'Red')
        .setThumbnail(
          'https://seeklogo.com/images/M/minecraft-youtube-logo-448E10AC2B-seeklogo.com.png'
        )

      const buttonsEmbed = []

      let newAttachment

      if (serverStatus.icon) {
        const newString = serverStatus.icon.split(',')[1]
        const buffer = Buffer.from(newString, 'base64')
        newAttachment = new AttachmentBuilder(buffer, {
          name: 'image.png'
        })

        embed.setThumbnail('attachment://image.png')
      }

      if (!serverStatus.online) {
        buttonsEmbed.push(
          new ButtonBuilder()
            .setCustomId('1')
            .setLabel('Abrir Server')
            .setStyle(ButtonStyle.Primary)
        )
      }

      if (buttonsEmbed.length !== 0) {
        const row = new ActionRowBuilder().addComponents(buttonsEmbed)

        await reply.edit({
          embeds: [embed],
          //@ts-expect-error don't really know what this error is for 😭
          components: [row]
        })

        const userRes = await reply
          .awaitMessageComponent({
            time: 20_000
          })
          .catch(async () => {
            await reply.edit({ embeds: [embed], components: [] })
          })

        if (!userRes) return

        const client = new Socket()

        client.connect(env.mcPortOpener, env.mcIp, () => {
          client.write('Open the server')
        })
        client.destroy()

        await reply.edit({ embeds: [embed], components: [] })
      } else {
        if (newAttachment) {
          reply.edit({
            embeds: [embed],
            files: [newAttachment]
          })
          return
        }
        reply.edit({
          embeds: [embed]
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}
