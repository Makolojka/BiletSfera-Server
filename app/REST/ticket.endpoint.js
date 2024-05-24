import business from '../business/business.container';
import eventDAO from "../DAO/eventDAO";
import ticketDAO from "../DAO/ticketDAO";

const ticketEndpoint = (router) => {
    // Get all tickets
    router.get('/api/tickets', async (request, response, next) => {
        try {
            let result = await business.getTicketManager().query();
            response.status(200).send(result);
        } catch (error) {
            console.log(error);
        }
    });

    //Get a single ticket
    router.get('/api/events/tickets/:id', async (request, response, next) => {
        let result = await business.getTicketManager().query();
        response.status(200).send(result.find(obj => obj.id === request.params.id));
    });

    // Create a single ticket //Deprecated
    router.post('/api/events/ticket', async (request, response, next) => {
        try {
            let result = await business.getTicketManager().createNewOrUpdate(request.body);
            response.status(200).send(result);
        } catch (error) {
            console.log(error);
        }
    });

    // Create a single ticket and return object id
    router.post('/api/events/ticket/id', async (request, response, next) => {
        try {
            let result = await business.getTicketManager().createNewOrUpdate(request.body);
            response.status(201).json(result);
        } catch (error) {
            console.log(error);
        }
    });

    // Returns tickets objects that participate in given event
    router.get('/api/events/:id/tickets', async (request, response, next) => {
        try {
            const eventId = request.params.id;
            const event = await eventDAO.get(eventId);

            if (!event) {
                return response.status(404).json({ error: 'Event not found' });
            }

            const ticketIds = event.tickets; // Get the array of ticket IDs from the event

            // Fetch the tickets using the ticketIds array and populate their details
            const tickets = await ticketDAO.model.find({ _id: { $in: ticketIds } });

            response.status(200).json(tickets);
        } catch (error) {
            console.log(error);
            response.status(500).json({ error: 'Internal server error' });
        }
    });

};
export default ticketEndpoint;
