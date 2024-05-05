const { Client, ActivityType } = require("discord.js");

const index = require("../../main.js");
const { loadCommands } = require("../../Handlers/CommandHandler");
const {getConfigurations} = require("../../Functions/Configuration");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    const { embedsConfig, configBasic } = getConfigurations();
    await loadCommands(client);

    console.log("Le bot est maintenant en ligne.");

    client.user.setPresence({
      activities: [
        {
          name: configBasic.status,
          type: ActivityType.Watching,
        },
      ],
      status: "idle",
    });
  },
};
