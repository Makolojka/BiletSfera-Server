import business from '../business/business.container';
import eventDAO from "../DAO/eventDAO";
import artistDAO from "../DAO/artistDAO";
import ticketDAO from "../DAO/ticketDAO";

const ticketEndpoint = (router) => {
    /**
     * @swagger
     * tags:
     *   name: Tickets
     *   description: API for managing tickets.
     */

    /**
     * @swagger
     * /api/tickets:
     *   get:
     *     summary: Get all tickets
     *     tags: [Tickets]
     *     responses:
     *       '200':
     *         description: A list of tickets
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Ticket'
     */
    // Get all tickets
    router.get('/api/tickets', async (request, response, next) => {
        try {
            let result = await business.getTicketManager().query();
            response.status(200).send(result);
        } catch (error) {
            console.log(error);
        }
    });

    /**
     * @swagger
     * /api/events/tickets/{id}:
     *   get:
     *     summary: Get a single ticket by ID
     *     tags: [Tickets]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID of the ticket to get
     *     responses:
     *       '200':
     *         description: The ticket details
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Ticket'
     */
    //Get a single ticket
    router.get('/api/events/tickets/:id', async (request, response, next) => {
        let result = await business.getTicketManager().query();
        response.status(200).send(result.find(obj => obj.id === request.params.id));
    });

    /**
     * @swagger
     * /api/events/ticket:
     *   post:
     *     summary: Create a new ticket
     *     tags: [Tickets]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Ticket'
     *     responses:
     *       '200':
     *         description: The created ticket
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Ticket'
     */
    // Create a single ticket
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

    /**
     * @swagger
     * /api/events/{id}/tickets:
     *   get:
     *     summary: Get tickets for a specific event
     *     tags: [Tickets]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID of the event to get tickets for
     *     responses:
     *       '200':
     *         description: A list of tickets for the event
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Ticket'
     */
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
