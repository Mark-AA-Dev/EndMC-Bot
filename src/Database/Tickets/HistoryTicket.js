const Ticket = require("../../Schemas/Tickets");
async function historyTicket(idTicket) {
  try {
    return await Ticket.findOne({ ticketId: idTicket });
  } catch (error) {
    console.error(error);
  }
}

module.exports = historyTicket;
