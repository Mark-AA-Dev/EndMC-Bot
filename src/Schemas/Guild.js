const mongoose = require("mongoose");
const { format } = require("date-fns");
const nowDate = new Date();

const guildSchema = mongoose.Schema({
  guildID: String,
  guildName: String,
  registeredAt: {
    type: String,
    default: format(nowDate, "EEEE d MMMM yyyy 'à' HH:mm:ss"),
  },
});

module.exports = mongoose.model("Guild", guildSchema);
