import transactionDAO from "../DAO/transactionDAO";
import eventDAO from "../DAO/eventDAO";

class OrganiserStatsService {
    // static async getTicketsSoldForEvent(eventId) {
    //     const transactions = await transactionDAO.getTransactionsForEvent(eventId);
    //     let totalTicketsSold = 0;
    //
    //     transactions.forEach(transaction => {
    //         const ticketsInTransaction = transaction.tickets || [];
    //         const ticketsSoldForEvent = ticketsInTransaction.filter(ticket => ticket.eventId === eventId);
    //         totalTicketsSold += ticketsSoldForEvent.length;
    //     });
    //
    //     return totalTicketsSold;
    // }

    //
    // static async getTicketsSoldForAllEvents(organiserName) {
    //     const events = await eventDAO.getEventsByOrganiser(organiserName).lean().exec();
    //     const ticketsSold = await Promise.all(
    //         events.map(async (event) => {
    //             const eventTransactions = await transactionDAO.getTransactionsForEvent(event._id);
    //             return eventTransactions.reduce((totalTickets, transaction) => totalTickets + transaction.tickets.length, 0);
    //         })
    //     );
    //     return ticketsSold.reduce((total, tickets) => total + tickets, 0);
    // }
}

export default OrganiserStatsService;
