const YAML = require("yaml");
const fs = require("fs");

let configBasic = null;
let embedsConfig = null;
let messagesConfig = null;

function loadAllConfigs() {
  const configFiles = {
    "Config/Config.yml": (config) => (configBasic = config),
    "Config/Embeds.yml": (config) => (embedsConfig = config),
    "Config/Messages.yml": (config) => (messagesConfig = config),
  };

  Object.entries(configFiles).forEach(([filePath, configSetter]) => {
    const yamlConfig = YAML.parse(fs.readFileSync(filePath, "utf-8"));
    configSetter(yamlConfig);
  });
}

function getConfigurations() {
  return {
    configBasic,
    embedsConfig,
    messagesConfig,
  };
}

module.exports = {
  loadAllConfigs,
  getConfigurations,
};
