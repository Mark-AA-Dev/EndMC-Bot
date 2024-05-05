const ascii = require("ascii-table");

const { loadFiles } = require("../Functions/FileLoader");

async function loadEvents(client) {
  const table = new ascii().setHeading("Events", "Status");
  const files = await loadFiles("Events");

  files.forEach((file) => {
    const event = require(file);
    const execute = (...args) => event.execute(...args, client);

    if (event.rest) {
      if (event.once) {
        client.rest.once(event.name, execute);
      } else {
        client.rest.on(event.name, execute);
      }
    } else {
      if (event.once) {
        client.once(event.name, execute);
      } else {
        client.on(event.name, execute);
      }
    }

    table.addRow(file.split("/").pop(), "✅");
  });

  return console.log(table.toString(), "\nEvents chargées.");
}

module.exports = { loadEvents };
