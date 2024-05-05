const Ticket = require("../../Schemas/Tickets");
async function updateTickets(ticketId, closedDate, transcriptUrl) {
  try {
    const ticket = await Ticket.findOne({ ticketId: ticketId });

    if (!ticket) {
      console.log("> [ERREUR] - Aucun Ticket trouvé");
      return;
    }

    ticket.closedDate = closedDate;
    ticket.transcriptUrl = transcriptUrl;

    await ticket.save();
  } catch (error) {
    console.error(error);
  }
}

module.exports = updateTickets;
