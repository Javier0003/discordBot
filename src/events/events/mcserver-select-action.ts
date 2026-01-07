import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Interaction } from 'discord.js'
import Event_Builder from '../../builders/event-builder';
import { RepositoryObj } from '../../repositories/services-registration';
import { statusJava } from 'node-mcstatus';
import env from '../../env';

export default class McserverModalResponseHandler extends Event_Builder<'interactionCreate'> {
    private readonly minecraftServersRepository: RepositoryObj['minecraftServersRepository'];
    constructor({ minecraftServersRepository }: RepositoryObj) {
        super({ eventType: 'interactionCreate', type: 'on', name: 'mcserverModalResponseHandler' })
        this.minecraftServersRepository = minecraftServersRepository;
    }

    async event(interaction: Interaction): Promise<void> {
        try {
            if (!interaction.isStringSelectMenu()) return;

            if (interaction.customId !== 'my_select') {
                return;
            }

            await interaction.deferReply();

            const selected = interaction.values[0]; // array for multi-select

            const server = await this.minecraftServersRepository.getById(Number(selected));

            if (!server) {
                await interaction.editReply({
                    content: `error: server not found`,
                })
                return;
            }

            const serverStatus = await statusJava(`${server.ip}`, server.port);

            let players = '';

            if (serverStatus.online) {
                if (serverStatus.players!.online > 0) {
                    serverStatus.players?.list.map(({ name_raw }) => {
                        players = players + `${name_raw}\n`
                    })
                }
            }


            const embed = new EmbedBuilder()
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
                const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttonsEmbed)

                const reply = await interaction.editReply({
                    embeds: [embed],
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

                const response = await fetch(`http://automcserver:${env.mcPortOpener}/open/${server.name}`, {
                    method: "POST"
                });

                if (response.ok) {
                    await userRes.reply('Se ha enviado la solicitud para abrir el servidor.')
                } else {
                    await userRes.reply('Hubo un error al solicitar la apertura del servidor.')
                }

                await reply.edit({ embeds: [embed], components: [] })
            } else {
                if (newAttachment) {
                    interaction.editReply({
                        embeds: [embed],
                        files: [newAttachment]
                    })
                    return
                }
                interaction.editReply({
                    embeds: [embed]
                })
            }

        } catch (error) {
            console.log(error)
        }
    }
}
