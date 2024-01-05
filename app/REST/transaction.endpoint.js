import business from '../business/business.container';
import eventDAO from "../DAO/eventDAO";
import artistDAO from "../DAO/artistDAO";
import transactionDAO from "../DAO/transactionDAO";
import auth from "../middleware/auth";
import mongoose from "mongoose";
import EventDAO from "../DAO/eventDAO";

const transactionEndpoint = (router) => {
    /**
     * @swagger
     * tags:
     *   name: Transactions
     *   description: API for managing transactions.
     */

    /**
     * @swagger
     * /api/transactions:
     *   get:
     *     summary: Get all transactions
     *     tags: [Transactions]
     *     responses:
     *       '200':
     *         description: A list of transactions
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Transaction'
     */
    // Get all transactions
    router.get('/api/transactions', async (request, response, next) => {
        try {
            let result = await business.getTransactionManager().query();
            response.status(200).send(result);
        } catch (error) {
            console.log(error);
        }
    });

    /**
     * @swagger
     * /api/transactions/transaction/{id}:
     *   get:
     *     summary: Get a single transaction by ID
     *     tags: [Transactions]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID of the transaction to get
     *     responses:
     *       '200':
     *         description: The transaction details
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Transaction'
     */
    //Get a single transaction
    router.get('/api/transactions/transaction/:id', async (request, response, next) => {
        let result = await business.getTransactionManager().query();
        response.status(200).send(result.find(obj => obj.id === request.params.id));
    });

    /**
     * @swagger
     * /api/transactions/transaction:
     *   post:
     *     summary: Create a new transaction
     *     tags: [Transactions]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Transaction'
     *     responses:
     *       '200':
     *         description: The created transaction
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Transaction'
     */
    // Create a single transaction
    router.post('/api/transactions/transaction', auth, async (request, response, next) => {
        const { userId, tickets } = request.body;

        try {
            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                // Iterate through each ticket in the request and update seats if required
                for (const ticket of tickets) {
                    const { eventId, seatNumbers } = ticket;

                    // Check if seat management is required for the event
                    const event = await EventDAO.model.findById(eventId).session(session);
                    const requiresSeatManagement = event.category.includes('Kino');
                    console.log("requiresSeatManagement: ", requiresSeatManagement)

                    if (requiresSeatManagement) {
                        await transactionDAO.updateIsAvailableForEventSeats(eventId, seatNumbers, session);
                    }
                }

                // Perform the transaction processing here
                const result = await business.getTransactionManager().createNewOrUpdate(request.body, session);
                await session.commitTransaction();
                session.endSession();

                response.status(200).send(result);
            } catch (error) {
                await session.abortTransaction();
                session.endSession();
                throw error; // Forward the error to the outer catch block
            }
        } catch (error) {
            console.error(error);
            response.status(500).send({ error: 'Server Error' });
        }
    });

    /**
     * @swagger
     * /api/transactions/all/{userId}:
     *   get:
     *     summary: Get all transactions for a given user
     *     description: Endpoint to retrieve all transactions for a specific user by user ID.
     *     tags: [Transactions]
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the user to retrieve transactions
     *     responses:
     *       '200':
     *         description: List of transactions for the user
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Transaction'
     *       '500':
     *         description: Internal Server Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Description of the server error
     */
    // Get all transactions for a given user
    router.get('/api/transactions/all/:userId', auth, async (request, response) => {
        try {
            const userId = request.params.userId;
            const transactions = await transactionDAO.getAllTransactionsByUserId(userId);

            response.status(200).json(transactions);
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @swagger
     * /api/organiser/stats/tickets-sold-by-event/{eventId}:
     *   get:
     *     summary: Get sold tickets for a specific event
     *     description: Endpoint to retrieve sold tickets for a specific event by event ID.
     *     tags: [Organiser]
     *     parameters:
     *       - in: path
     *         name: eventId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the event to retrieve sold tickets
     *     responses:
     *       '200':
     *         description: List of sold tickets for the event
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 ticketsSold:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Transaction'
     *                   description: List of sold tickets for the event
     *       '500':
     *         description: Internal Server Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Description of the server error
     */
    // Returns sold tickets for specific event
    router.get('/api/organiser/stats/tickets-sold-by-event/:eventId', async (req, res) => {
        const {eventId} = req.params;
        try {
            const ticketsSold = await transactionDAO.getTransactionsForEvent(eventId);
            res.status(200).json({ticketsSold});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Failed to retrieve tickets sold for the event.'});
        }
    });

    /**
     * @swagger
     * /api/organiser/stats/tickets-sold-by-organiser/{organiserName}:
     *   get:
     *     summary: Get sold tickets for a specific organizer
     *     description: Endpoint to retrieve sold tickets for a specific organizer by organizer name.
     *     tags: [Organiser]
     *     parameters:
     *       - in: path
     *         name: organiserName
     *         required: true
     *         schema:
     *           type: string
     *         description: Name of the organizer to retrieve sold tickets
     *     responses:
     *       '200':
     *         description: Number of sold tickets for the organizer
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 ticketsSold:
     *                   type: number
     *                   description: Number of sold tickets for the organizer
     *       '500':
     *         description: Internal Server Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Description of the server error
     */
    // Returns sold tickets for specific organizer
    router.get('/api/organiser/stats/tickets-sold-by-organiser/:organiserName', async (req, res) => {
        const { organiserName } = req.params;
        try {
            const ticketsSold = await transactionDAO.countTicketsSoldForOrganiser(organiserName);
            res.status(200).json({ ticketsSold });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve tickets sold for the organizer.' });
        }
    });

    /**
     * @swagger
     * /api/organiser/stats/total-earnings-by-organiser/{organiserName}:
     *   get:
     *     summary: Get total earnings for a specific organizer
     *     description: Endpoint to retrieve total earnings for a specific organizer by organizer name.
     *     tags: [Organiser]
     *     parameters:
     *       - in: path
     *         name: organiserName
     *         required: true
     *         schema:
     *           type: string
     *         description: Name of the organizer to retrieve total earnings
     *     responses:
     *       '200':
     *         description: Total earnings for the organizer
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 totalEarnings:
     *                   type: number
     *                   description: Total earnings for the organizer
     *       '500':
     *         description: Internal Server Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Description of the server error
     */
    // Returns total earnings for a given organiser name
    router.get('/api/organiser/stats/total-earnings-by-organiser/:organiserName', async (req, res) => {
        const { organiserName } = req.params;
        try {
            const totalEarnings = await transactionDAO.calculateTotalEarningsForOrganiser(organiserName);
            res.status(200).json({ totalEarnings });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve total earnings for the organizer.' });
        }
    });

    /**
     * @swagger
     * /api/organiser/stats/total-earnings-by-event/{eventId}:
     *   get:
     *     summary: Get total earnings for a specific event
     *     description: Endpoint to retrieve total earnings for a specific event by event ID.
     *     tags: [Organiser]
     *     parameters:
     *       - in: path
     *         name: eventId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the event to retrieve total earnings
     *     responses:
     *       '200':
     *         description: Total earnings for the event
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 totalEarningsForEvent:
     *                   type: number
     *                   description: Total earnings for the event
     *       '500':
     *         description: Internal Server Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Description of the server error
     */
    // Returns total earnings for a specific event
    router.get('/api/organiser/stats/total-earnings-by-event/:eventId', async (req, res) => {
        const { eventId } = req.params;
        try {
            const totalEarningsForEvent = await transactionDAO.calculateTotalEarningsForEvent(eventId);
            res.status(200).json({ totalEarningsForEvent });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to calculate total earnings for the event.' });
        }
    });

    /**
     * @swagger
     * /api/organiser/stats/total-views-by-organiser/{organiserName}:
     *   get:
     *     summary: Get total views earned by all events for a given organiser
     *     description: Endpoint to retrieve total views earned by all events for a specific organizer by organizer name.
     *     tags: [Organiser]
     *     parameters:
     *       - in: path
     *         name: organiserName
     *         required: true
     *         schema:
     *           type: string
     *         description: Name of the organizer to retrieve total views
     *     responses:
     *       '200':
     *         description: Total views earned by all events for the organizer
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 totalViews:
     *                   type: number
     *                   description: Total views earned by all events for the organizer
     *       '500':
     *         description: Internal Server Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Description of the server error
     */
    // Returns total views earned by all events for given organiser
    router.get('/api/organiser/stats/total-views-by-organiser/:organiserName', async (req, res) => {
        const { organiserName } = req.params;
        try {
            const totalViews = await transactionDAO.calculateTotalViewsForOrganiser(organiserName);
            res.status(200).json({ totalViews });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve total views for the organizer.' });
        }
    });

    /**
     * @swagger
     * /api/organiser/sale-data/{organiserName}:
     *   get:
     *     summary: Get sale data for charts for all sales by organiser
     *     description: Endpoint to retrieve sale data for charts for all sales made by a specific organiser.
     *     tags: [Organiser]
     *     parameters:
     *       - in: path
     *         name: organiserName
     *         required: true
     *         schema:
     *           type: string
     *         description: Name of the organizer to retrieve sale data
     *     responses:
     *       '200':
     *         description: Sale data for charts for all sales by organiser
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 saleData:
     *                   type: object
     *                   description: Sale data for charts for all sales by organiser
     *       '500':
     *         description: Internal Server Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Description of the server error
     */
    // Returns sale data for charts for all sales
    router.get('/api/organiser/sale-data/:organiserName', async (req, res) => {
        const { organiserName } = req.params;
        try {
            const saleData = await transactionDAO.getSaleDataForOrganiser(organiserName);
            res.status(200).json({ saleData });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve sale data.' });
        }
    });


};
export default transactionEndpoint;
