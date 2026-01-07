import Event_Builder from '../../builders/event-builder'
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Interaction } from 'discord.js'
import { RepositoryObj } from '../../repositories/services-registration';
import { statusJava } from 'node-mcstatus';

export default class McserverModalResponseHandler extends Event_Builder<'interactionCreate'> {
    private readonly minecraftServersRepository: RepositoryObj['minecraftServersRepository'];
    constructor({ minecraftServersRepository }: RepositoryObj) {
        super({ eventType: 'interactionCreate', type: 'on', name: 'mcserverModalResponseHandler' })
        this.minecraftServersRepository = minecraftServersRepository;
    }

    async event(interaction: Interaction): Promise<void> {
        try {
            //@ts-expect-error -- discord.js types are broken here ---
            await interaction.deferReply();

            if (!interaction.isModalSubmit()) return;

            if (interaction.customId !== 'mcserver_modal') {
                return;
            }

            const serverName = interaction.fields.getTextInputValue('server_name');

            const server = await this.minecraftServersRepository.getByName(serverName);

            if (!server) {
                await interaction.editReply({
                    content: `No se encontró ningún servidor con el nombre "${serverName}". Por favor, verifica el nombre e inténtalo de nuevo.`,
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

                const reply = await interaction.reply({
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

                const response = await fetch(`http://automcserver:${server.port}/open/${server.name}`, {
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
