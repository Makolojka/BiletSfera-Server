/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API for managing events.
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       '200':
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get a single event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the event to get
 *     responses:
 *       '200':
 *         description: The event details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */

/**
 * @swagger
 * /events/transaction:
 *   post:
 *     summary: Create a single event using transactions
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       '200':
 *         description: Event and tickets created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indicating successful creation
 *                 event:
 *                   $ref: '#/components/schemas/Event'
 *       '500':
 *         description: Error creating event and tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indicating the error
 *                 error:
 *                   type: string
 *                   description: Description of the error
 */

/**
 * @swagger
 * /api/event/likes-follows/{eventId}/{userId}/{actionType}:
 *   post:
 *     summary: Add like or follower to an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the event
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *       - in: path
 *         name: actionType
 *         schema:
 *           type: string
 *         required: true
 *         description: Type of action (like/follow)
 *     responses:
 *       '200':
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /api/event/likes-follows/{eventId}/{actionType}:
 *   get:
 *     summary: Get likes or followers count for an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the event
 *       - in: path
 *         name: actionType
 *         schema:
 *           type: string
 *         required: true
 *         description: Type of action (like/follow)
 *     responses:
 *       '200':
 *         description: Likes or followers count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 */

/**
 * @swagger
 * /api/event/views/{eventId}:
 *   post:
 *     summary: Increment views for an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the event
 *     responses:
 *       '200':
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */