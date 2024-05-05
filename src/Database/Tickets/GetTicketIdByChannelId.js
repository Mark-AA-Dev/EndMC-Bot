const Ticket = require("../../Schemas/Tickets");
async function getTicketIdByChannelId(channelId) {
  try {
    const ticket = await Ticket.findOne({ channelId: channelId });

    if (!ticket) {
      console.log("> [ERREUR] - Aucun Ticket trouvé par l'id.");
      return null;
    }

    return ticket.ticketId;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = getTicketIdByChannelId;
