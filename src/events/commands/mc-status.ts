import {
  CacheType,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  AttachmentBuilder,
  ChatInputCommandInteraction
} from 'discord.js'
import Command_Builder from '../../structures/command-builder'
import { Socket } from 'node:net'

//@ts-expect-error (no type declarations sadly)
import { MinecraftServerListPing } from 'minecraft-status'
import env from '../../env'

const open = () => {
  const client = new Socket()

  client.connect(env.mcPortOpener, env.mcIp, () => {
    client.write('Open the server')
    client.destroy()
  })
}

export default class McStatus extends Command_Builder {
  private playerCount: string = ''

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

      const serverStatus = await MinecraftServerListPing.ping(
        4, //protocol (idk, default 4 works (here might be the answer if error https://wiki.vg/Protocol_version_numbers))
        process.env.MC_IP,
        process.env.MC_PORT, //server port
        2000 //timeout (discord limit is 3000, recomended to be lower than that)
      ).catch(false)

      if (serverStatus) {
        if (serverStatus.players.online > 0) {
          serverStatus.players.sample.map(({ name }: { name: string }) => {
            this.playerCount = this.playerCount + `${name}\n`
          })
        }
      }
      embed
        .setTitle('Minecraft Server Status')
        .setDescription(
          serverStatus ? serverStatus.description.text : 'Server is Offline'
        )
        .addFields({
          name: serverStatus
            ? `Players online: ${serverStatus.players.online}`
            : ' ',
          value: serverStatus ? this.playerCount : ' ',
          inline: true
        })
        .setTimestamp(new Date())
        .setColor(serverStatus ? 'Green' : 'Red')
        .setThumbnail(
          'https://seeklogo.com/images/M/minecraft-youtube-logo-448E10AC2B-seeklogo.com.png'
        )

      const buttonsEmbed = []

      let newAttachment

      if (serverStatus.favicon) {
        const newString = serverStatus.favicon.split(',')[1]
        const buffer = Buffer.from(newString, 'base64')
        newAttachment = new AttachmentBuilder(buffer, {
          name: 'image.png'
        })

        embed.setThumbnail('attachment://image.png')
      }

      if (!serverStatus) {
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
        open()
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
