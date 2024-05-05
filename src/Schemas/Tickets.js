const mongoose = require("mongoose");
const { format } = require("date-fns");
const nowDate = new Date();

const ticketSchema = mongoose.Schema({
  guildId: String,
  ticketId: Number,
  userOpenTicket: String,
  channelId: String,
  registeredAt: {
    type: String,
    default: format(nowDate, "EEEE d MMMM yyyy 'à' HH:mm:ss"),
  },
  openDate: {
    type: String,
    default: null
  },
  closedDate: {
    type: String,
    default: null,
  },
  transcriptUrl: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Tickets", ticketSchema);
