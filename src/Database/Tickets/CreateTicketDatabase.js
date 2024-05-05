const Tickets = require("../../Schemas/Tickets");
const { Schema } = require("mongoose");

async function createTicketDatabase(guildId, memberId, channelId, openDate) {
  try {
    const highTicket = await Tickets.findOne({ guildId: guildId }).sort({
      ticketId: -1,
    });

    let ticketId = 1;

    if (highTicket) {
      ticketId = highTicket.ticketId + 1;
    }

    const newUserTicket = new Tickets({
      guildId: guildId,
      ticketId: ticketId,
      userOpenTicket: memberId,
      channelId: channelId,
      openDate: openDate,
    });

    await newUserTicket.save();
  } catch (error) {
    console.error(error);
  }
}

module.exports = createTicketDatabase;
