import Event_Builder from '../../../builders/event-builder'
import { Interaction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js'

export default class McModal extends Event_Builder<'interactionCreate'> {
    constructor() {
        super({ eventType: 'interactionCreate', type: 'on', name: 'McModal' })
    }

    async event(interaction: Interaction): Promise<void> {
        try {
            if (interaction.isButton() && interaction.customId === 'open_mc_modal') {
                const modal = new ModalBuilder()
                    .setCustomId('mcserver_modal')
                    .setTitle('Enter server name');
                    
                const input = new TextInputBuilder()
                    .setCustomId('server_name')
                    .setLabel('Enter the server name')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const row = new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(input);

                modal.addComponents(row);

                await interaction.showModal(modal);
            }

        } catch (error) {
            console.log(error)
        }
    }
}


