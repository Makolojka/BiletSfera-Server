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
    router.get('/api/organiser/stats/tickets-sold/:eventId', async (req, res) => {
        const {eventId} = req.params;
        try {
            const ticketsSold = await transactionDAO.getTransactionsForEvent(eventId);
            res.status(200).json({ticketsSold});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Failed to retrieve tickets sold for the event.'});
        }
    });
};
export default transactionEndpoint;
