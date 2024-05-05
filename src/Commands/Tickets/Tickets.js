const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} = require("discord.js");
const {
  getConfigurations,
} = require("../../Functions/Configuration");
const { createEmbed } = require("../../Functions/CreateEmbed");
const historyTicket = require("../../Database/Tickets/HistoryTicket");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDMPermission(false)
    .setDescription("🧷 - Mise en place du système de Ticket.")
    .addSubcommand((subcommand) =>
      subcommand.setName("panel").setDescription("🔧 - Panel de Tickets")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("➕ - Ajouter un utilisateur au Ticket")
        .addUserOption((option) =>
          option
            .setName("joueur")
            .setDescription("Joueur à PING")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("➖ - Enlever un utilisateur du Ticket")
        .addUserOption((option) =>
          option
            .setName("joueur")
            .setDescription("Joueur à PING")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("history")
        .setDescription("📊 - Afficher l'historique d'un Ticket")
        .addIntegerOption((option) =>
          option
            .setName("id_ticket")
            .setDescription("Id Ticket")
            .setRequired(true)
        )
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { embedsConfig, configBasic, messagesConfig } = getConfigurations();

    if (!interaction.member.permissions.has("ADMINISTRATOR"))
      return interaction.reply({
        content: messagesConfig.no_permission,
        ephemeral: true,
      });

    const subCommand = interaction.options.getSubcommand();
    switch (subCommand) {
      case "panel":
        if (!configBasic.system_active.ticket) {
          await interaction.reply({
            content: messagesConfig.system_desactivate,
            ephemeral: true,
          });
          return false;
        }

        const panelEmbedConfig = embedsConfig.tickets.setup;
        const embedPanel = createEmbed(panelEmbedConfig, embedsConfig);

        const selectMenuBuilder = new StringSelectMenuBuilder()
          .setCustomId("ticket")
          .setPlaceholder(
            embedsConfig.tickets["select-menu"].placeholder
          );

        const categoryConfig = embedsConfig.tickets["select-menu"];
        Object.keys(categoryConfig).forEach((key, index) => {
          if (key.startsWith("option")) {
            const category = categoryConfig[key];
            const optionBuilder = new StringSelectMenuOptionBuilder().setLabel(
              category.name
            );

            if (category.emoji) {
              optionBuilder.setEmoji(category.emoji);
            }

            selectMenuBuilder.addOptions(optionBuilder.setValue(key));
          }
        });

        const row = new ActionRowBuilder().addComponents(selectMenuBuilder);

        await interaction.reply({ embeds: [embedPanel], components: [row] });
        return;

      case "add":
        if (interaction.channel.name.includes("🎫")) {
          const member = interaction.options.getUser("joueur");

          try {
            await interaction.channel.permissionOverwrites.edit(member.id, {
              ViewChannel: true,
            });
            const panelEmbedTicketAdd = embedsConfig.tickets.add_command;
            const variableReplacements = {
              userMention: interaction.user,
              username: interaction.user.username,
              targetMention: member,
              targetUsername: member.username,
            };

            const embed = createEmbed(
                panelEmbedTicketAdd,
                embedsConfig,
                variableReplacements
            );

            await interaction.reply({ embeds: [embed] });
          } catch (err) {
            await interaction.reply({
              content:
                "> Une erreur vient de survenir lors de l'ajout d'un utilisateur dans le ticket !",
              ephemeral: true,
            });
          }
        }
        return;

      case "remove":
        if (interaction.channel.name.includes("🎫")) {
          const member = interaction.options.getUser("joueur");

          try {
            await interaction.channel.permissionOverwrites.edit(member.id, {
              ViewChannel: false,
            });

            const panelEmbedRemove = embedsConfig.tickets.remove_command;
            const variableReplacements = {
              userMention: interaction.user,
              username: interaction.user.username,
              targetMention: member,
              targetUsername: member.username,
            };

            const embed = createEmbed(
                panelEmbedRemove,
                embedsConfig,
                variableReplacements
            );
            await interaction.reply({ embeds: [embed] });
          } catch (err) {
            await interaction.reply({
              content:
                "> Une erreur vient de survenir lors de l'ajout d'un utilisateur dans le ticket !",
              ephemeral: true,
            });
          }
        }
        return;

      case "history":
        const idTicket = interaction.options.getInteger("id_ticket");
        const infoTicket = await historyTicket(idTicket);
        if (!infoTicket) {
          await interaction.reply({
            content: "> Aucun ticket trouvé avec cette ID !",
            ephemeral: true,
          });
          return false;
        }
        const userTarget = client.users.fetch(infoTicket.userOpenTicket);
        const embedConfigHistory = embedsConfig.tickets.history_command;
        const variableReplacements = {
          id: idTicket,
          userOpenTicket: infoTicket.userOpenTicket,
          registeredAt: infoTicket.registeredAt,
          closedDate: infoTicket.closedDate,
          transcriptUrl: infoTicket.transcriptUrl,
          userNameOpenTicket: (await userTarget).username,
        };

        const embedHistory = createEmbed(
          embedConfigHistory,
          embedsConfig,
          variableReplacements
        );
        await interaction.reply({ embeds: [embedHistory] });

        return;
    }
  },
};
