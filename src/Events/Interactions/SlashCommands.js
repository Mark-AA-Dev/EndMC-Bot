const Discord = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    let executeFunction;

    const command = client.commands.get(interaction.commandName);
    if (!command)
      return interaction.reply({
        content: `Cette commande n'est plus disponible.`,
        ephemeral: true,
      });
    executeFunction = command.execute;

    const response = await executeFunction(interaction, client);

    if (response) {
      const parsedResponse = {
        content: response.content || null,
        embeds: response.embeds || [],
        ephemeral: response.ephemeral || false,
      };

      if (response instanceof Discord.EmbedBuilder)
        parsedResponse.embeds.push(response);
      if (response instanceof String) parsedResponse.content = response;

      if (interaction.replied || interaction.deferred) {
        await interaction.editReply(parsedResponse);
      } else {
        await interaction.reply(parsedResponse);
      }
    }
  },
};
