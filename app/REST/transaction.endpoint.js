import business from '../business/business.container';
import eventDAO from "../DAO/eventDAO";
import artistDAO from "../DAO/artistDAO";
import transactionDAO from "../DAO/transactionDAO";

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
    router.post('/api/transactions/transaction', async (request, response, next) => {
        try {
            let result = await business.getTransactionManager().createNewOrUpdate(request.body);
            response.status(200).send(result);
        } catch (error) {
            console.log(error);
        }
    });

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
