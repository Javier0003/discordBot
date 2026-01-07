import {
  CacheType,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  AttachmentBuilder,
  ChatInputCommandInteraction,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js'
import Command from '../../builders/command-builder'
import { statusJava } from 'node-mcstatus'
import env from '../../env'
import { RepositoryObj } from '../../repositories/services-registration'

export default class McStatus extends Command {
  private readonly minecraftServersRepository: RepositoryObj['minecraftServersRepository'];

  constructor({ minecraftServersRepository }: RepositoryObj) {
    super({
      name: 'mcserver',
      description: 'Revisar el estado del server de minecraft',
      notUpdated: false
    })

    this.minecraftServersRepository = minecraftServersRepository;
  }
  public async command(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    try {
      await interaction.deferReply();

      const embed = new EmbedBuilder()
        .setTitle('Minecraft Server Status')
        .setDescription('Esperate un momento')
        .setTimestamp(new Date())

      const servers = await this.minecraftServersRepository.getAll();

      let serverString = ""

      for(let i = 0; i < servers.length; i++) {
        const server = servers[i];
        serverString += `**${server.name}**\n`;
      }

      embed.addFields({ name: 'Servers', value: serverString, inline: true })

      const button = new ButtonBuilder()
        .setCustomId('open_mc_modal')
        .setLabel('Enter server name')
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(button);


      await interaction.editReply({
        embeds: [embed],
        components: [row],
      })

    } catch (error) {
      console.log(error)
    }
  }
}
