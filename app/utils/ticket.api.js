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

/**
 * @swagger
 * /api/events/ticket/{id}:
 *   post:
 *     summary: Create a single ticket and return object ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the ticket
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       '201':
 *         description: The created ticket with ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 */

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