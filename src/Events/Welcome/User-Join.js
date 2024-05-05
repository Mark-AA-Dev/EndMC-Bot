const { createEmbed } = require("../../Functions/CreateEmbed");
const CreateUser = require("../../Database/User/CreateUser");
const {getConfigurations} = require("../../Functions/Configuration");

module.exports = {
  name: "guildMemberAdd",
  async execute(member, client) {
    const { embedsConfig, configBasic } = getConfigurations();

    const embedConfig = embedsConfig.welcome;
    const variableReplacements = {
      username: member.user.username,
      memberCount: member.guild.memberCount,
    };

    await CreateUser(member);
    const embed = createEmbed(
      embedConfig,
      embedsConfig,
      variableReplacements
    );

    const specificChannel = await member.guild.channels.cache.get(
      configBasic.channels.welcomeChannelId
    );

    if (specificChannel) {
      specificChannel.send({ embeds: [embed] });
    }
  },
};
