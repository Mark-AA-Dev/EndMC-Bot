const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
} = require("discord.js");
const {getConfigurations} = require("../../Functions/Configuration");
const { embedsConfig, configBasic } = getConfigurations();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDMPermission(false)
    .setDescription(configBasic.command.ping),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    return { content: "Pong!", ephemeral: true };
  },
};
