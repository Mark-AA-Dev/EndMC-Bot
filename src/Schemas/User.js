const mongoose = require("mongoose");
const { format } = require("date-fns");
const nowDate = new Date();

const userSchema = mongoose.Schema({
  userId: String,
  guildId: String,
  warns: {
    type: Array,
    default: null,
  },
  registeredAt: {
    type: String,
    default: format(nowDate, "EEEE d MMMM yyyy 'à' HH:mm:ss"),
  },
});

module.exports = mongoose.model("User", userSchema, "users");
