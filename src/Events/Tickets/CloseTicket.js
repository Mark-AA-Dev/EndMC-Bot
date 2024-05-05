
const { createEmbed } = require("../../Functions/CreateEmbed");
const getTicketIdByChannelId = require("../../Database/Tickets/GetTicketIdByChannelId");
const updateTickets = require("../../Database/Tickets/UpdateTickets");
const discordTranscripts = require('discord-html-transcripts');
const {getConfigurations} = require("../../Functions/Configuration");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
      const { embedsConfig, configBasic, messagesConfig } = getConfigurations();

      if (!interaction.isButton()) {
        return;
      }

      if (interaction.customId !== "close-tickets") {
        return;
      }

      const now = new Date();

      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      const dateClosed = `${day}/${month}/${year} à ${hours}:${minutes}:${seconds}`;

      const logsChannel = await interaction.guild.channels.cache.get(
          configBasic.channels.ticketLogsChannelId
      );

      const attachment = await discordTranscripts.createTranscript(interaction.channel);

      if (logsChannel) {
        const panelEmbedConfig = embedsConfig.tickets.logs;
        const variableReplacements = {
          userMention: interaction.user,
          username: interaction.user.username,
          createdDate: `${dateClosed}`,
          closedDate: `${dateClosed}`,
        };

        const embed = createEmbed(
            panelEmbedConfig,
            embedsConfig,
            variableReplacements
        );

          const message = await logsChannel.send({ embeds: [embed] });
          const thread = await message.startThread({
              name: `Transcript`,
              type: "GUILD_PUBLIC_THREAD",
              autoArchiveDuration: 1440,
          });

          await thread.send({ files: [attachment] });
      }

      const idTicket = await getTicketIdByChannelId(interaction.channel.id);
      await updateTickets(idTicket, dateClosed, attachment.url);

      await interaction.reply({ content: messagesConfig.tickets.close_ticket });

      setTimeout(async () => {
          await interaction.channel.delete();
      }, 3000);
  },
};
