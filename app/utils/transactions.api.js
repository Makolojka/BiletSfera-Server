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

/**
 * @swagger
 * /api/organiser/stats/tickets-sold-by-organiser/{organiserName}:
 *   get:
 *     summary: Get sold tickets for a specific organiser
 *     description: Endpoint to retrieve sold tickets for a specific organiser by organiser name.
 *     tags: [Organiser]
 *     parameters:
 *       - in: path
 *         name: organiserName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the organiser to retrieve sold tickets
 *     responses:
 *       '200':
 *         description: Number of sold tickets for the organiser
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ticketsSold:
 *                   type: number
 *                   description: Number of sold tickets for the organiser
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

/**
 * @swagger
 * /api/organiser/stats/total-earnings-by-organiser/{organiserName}:
 *   get:
 *     summary: Get total earnings for a specific organiser
 *     description: Endpoint to retrieve total earnings for a specific organiser by organiser name.
 *     tags: [Organiser]
 *     parameters:
 *       - in: path
 *         name: organiserName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the organiser to retrieve total earnings
 *     responses:
 *       '200':
 *         description: Total earnings for the organiser
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalEarnings:
 *                   type: number
 *                   description: Total earnings for the organiser
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

/**
 * @swagger
 * /api/organiser/stats/total-views-by-organiser/{organiserName}:
 *   get:
 *     summary: Get total views earned by all events for a given organiser
 *     description: Endpoint to retrieve total views earned by all events for a specific organiser by organiser name.
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
 *         description: Total views earned by all events for the organiser
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalViews:
 *                   type: number
 *                   description: Total views earned by all events for the organiser
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
 *         description: Name of the organiser to retrieve sale data
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