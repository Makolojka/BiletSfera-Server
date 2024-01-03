import business from '../business/business.container';
import eventDAO from "../DAO/eventDAO";
import userDAO from "../DAO/userDAO";
import applicationException from "../service/applicationException";
import OrganiserStatsService from "../service/organiserStatsService";

const organiserStatsEndpoint = (router) => {
// Endpoint for getting tickets sold for a specific event
//     router.get('/api/organiser/stats/tickets-sold/:eventId', async (req, res) => {
//         const {eventId} = req.params;
//         try {
//             const ticketsSold = await OrganiserStatsService.getTicketsSoldForEvent(eventId);
//             res.status(200).json({ticketsSold});
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({error: 'Failed to retrieve tickets sold for the event.'});
//         }
//     });

// // Endpoint for getting tickets sold for all events of an organiser
//     router.get('/api/organiser/stats/tickets-sold-all/:organiserName', async (req, res) => {
//         const {organiserName} = req.params;
//         try {
//             const ticketsSold = await OrganiserStatsService.getTicketsSoldForAllEvents(organiserName);
//             res.status(200).json({ticketsSold});
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({error: 'Failed to retrieve tickets sold for all events.'});
//         }
//     });
}
export default organiserStatsEndpoint;