require("dotenv").config();

const Discord = require("discord.js");
const Mongoose = require("mongoose");

const { loadEvents } = require("./Handlers/EventHandler");
const { processErrorHandler } = require("./Handlers/ErrorHandler");
const {loadAllConfigs} = require("./Functions/Configuration");

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMessageReactions,
    Discord.GatewayIntentBits.MessageContent,
  ],
  partials: [
    Discord.Partials,
    Discord.Partials.Message,
    Discord.Partials.GuildMember,
    Discord.Partials.ThreadMember,
    Discord.Partials.Reaction,
  ],
});

loadAllConfigs();
processErrorHandler();

client.commands = new Discord.Collection();
client.subCommands = new Discord.Collection();

module.exports.client = client;

Mongoose.connect(process.env.MONGODB_URL).then(async () => {
  console.log("Le client est connecté à la base de données.");

  await loadEvents(client);
  client.login(process.env.DISCORD_TOKEN).then(() => {});
});
