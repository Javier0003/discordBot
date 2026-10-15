import {
  ActionRowBuilder,
  CacheType,
  ChatInputCommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import Command from "../../builders/command-builder";
import OptionBuilder from "../../builders/option-builder";
import UserRepository from "@loabot/persistance/dist/repositories/user-repository";
import { RepositoryObj } from "@loabot/persistance";

const options = new OptionBuilder()
  .addIntOption({ name: "puerto", description: "puerto" })
  .addStringOption({ name: "ip", description: "ip" })
  .addStringOption({ name: "nombre", description: "nombre" })
  .build();
export default class TestCommand extends Command<typeof options> {
  private readonly _userRepository: UserRepository;
  constructor({ userRepository }: RepositoryObj) {
    super({
      name: "test-command",
      description: "command for testing stuff 👍",
      devOnly: true,
      testOnly: false,
      options: options,
      deleted: false,
      notUpdated: true,
    });

    this._userRepository = userRepository;
  }
  public async command(interaction: ChatInputCommandInteraction<CacheType>) {
    try {
      const puerto = this.getOption("ip");

      const reply = await interaction.deferReply();

      // const test = await this._userRepository.getAll();

      // console.log(test)

      // interaction.reply({ allowedMentions: { parse: ['everyone'] }, content: "test", tts: true })
      await reply.edit({ content: "Test command executed" });
    } catch (error) {
      console.log(error);
    }
  }
}
