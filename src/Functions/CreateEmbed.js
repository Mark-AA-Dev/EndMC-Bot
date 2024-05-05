const { EmbedBuilder } = require("discord.js");

function createEmbed(
  embedConfig,
  defaultEmbedConfig,
  variableReplacements = {}
) {
  const embed = new EmbedBuilder();

  const defaultColor = defaultEmbedConfig.default_embed.color;

  for (const key in embedConfig) {
    const methodName = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;

    if (
      typeof embed[methodName] === "function" &&
      key !== "footer_text" &&
      key !== "footer_img" &&
      key !== "color" &&
      key !== "timestamp" &&
      key !== "fields"
    ) {
      let text = embedConfig[key];
      if (typeof text === "string") {
        for (const variable in variableReplacements) {
          text = text.replaceAll(
            `%${variable}%`,
            variableReplacements[variable]
          );
        }
        embed[methodName](text);
      }
    }
  }

  if (embedConfig.fields) {
    for (const field of embedConfig.fields) {
      let name = field.name;
      let value = field.value;
      let inline = field.inline || false;

      for (const variable in variableReplacements) {
        name = name.replaceAll(`%${variable}%`, variableReplacements[variable]);
        value = value.replaceAll(
          `%${variable}%`,
          variableReplacements[variable]
        );
      }

      embed.addFields({ name, value, inline });
    }
  }

  let color = embedConfig.color;
  if (color && ["default", "error", "success"].includes(color)) {
    color = defaultColor[color];
  }

  if (color) {
    embed.setColor(color);
  }

  if (embedConfig.footer_text || embedConfig.footer_img) {
    let footerText = embedConfig.footer_text || "";
    for (const variable in variableReplacements) {
      footerText = footerText.replaceAll(
        `%${variable}%`,
        variableReplacements[variable]
      );
    }
    embed.setFooter({ text: footerText, iconURL: embedConfig.footer_img });
  }

  if (embedConfig.timestamp) {
    embed.setTimestamp();
  }

  return embed;
}

module.exports = { createEmbed };
