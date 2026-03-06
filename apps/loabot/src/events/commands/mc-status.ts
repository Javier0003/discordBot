import {
  CacheType,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  AttachmentBuilder,
  ChatInputCommandInteraction,
  TextInputBuilder,
  TextInputStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} from 'discord.js'
import Command from '../../builders/command-builder'
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
        .setDescription('servidores de minecraft registrados')
        .setTimestamp(new Date())

      const servers = await this.minecraftServersRepository.getAll();


      const options = servers.map(server => {
        const obj = new StringSelectMenuOptionBuilder()
          .setLabel(server.name)
          .setDescription(`Check status of ${server.name}`)
          .setValue(`${server.idServer}`)

        return obj
      })

      const select = new StringSelectMenuBuilder()
        .setCustomId('my_select')
        .setPlaceholder('Choose an option')
        .addOptions(
          ...options
        );

      const rowSelect = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(select);


      await interaction.editReply({
        embeds: [embed],
        components: [rowSelect],
      })

    } catch (error) {
      console.log(error)
    }
  }
}
