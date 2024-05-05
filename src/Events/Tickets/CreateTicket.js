const {
  PermissionsBitField,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");
const {
  loadConfigBasic,
  loadEmbedsConfig,
  loadMessagesConfig, getConfigurations,
} = require("../../Functions/Configuration");
const { createEmbed } = require("../../Functions/CreateEmbed");
const CreateTicketDatabase = require("../../Database/Tickets/CreateTicketDatabase");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { embedsConfig, configBasic, messagesConfig } = getConfigurations();

    if (!interaction.isStringSelectMenu()) {
      return;
    }

      if (!configBasic.system_active.ticket) {
        await interaction.reply({
          content: messagesConfig.system_desactivate,
          ephemeral: true,
        });
        return false;
      }

      const selectedOption = interaction.values[0];

      const optionsConfig = embedsConfig.tickets["select-menu"];
      const optionName = optionsConfig[selectedOption]?.name;

      const supportChannelName =
        embedsConfig.tickets.name_channel.replaceAll(
          "%user%",
          interaction.user.username
        );

      const ticketChannel = await interaction.message.guild.channels.create({
        name: supportChannelName,
        permissionOverwrites: [
          {
            id: interaction.user.id,
            allow: [
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ViewChannel,
            ],
          },
          {
            id: configBasic.role.staff_role,
            allow: [
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ViewChannel,
            ],
          },
          {
            id: interaction.message.guild.roles.everyone,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
        ],
        channelType: "GUILD_TEXT",
        parent: configBasic.category.ticketCategoryId,
      });

      const now = new Date();

      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const createdDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

      const panelEmbedConfig = embedsConfig.tickets.in_ticket;
      const variableReplacements = {
        name_category: optionName,
        username: interaction.user.username,
        createdDate: createdDate,
      };

      const embed = createEmbed(
          panelEmbedConfig,
          embedsConfig,
          variableReplacements
      );

      const closeButton = new ButtonBuilder()
        .setCustomId("close-tickets")
        .setLabel(embedsConfig.tickets.button_close.name)
        .setEmoji(embedsConfig.tickets.button_close.emoji)
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder().addComponents(closeButton);

      await ticketChannel.send(`${interaction.user}`);
      await ticketChannel.send({ embeds: [embed], components: [row] });

      await CreateTicketDatabase(
        interaction.guild.id,
        interaction.user.id,
        ticketChannel.id,
        createdDate
      );
  },
};
