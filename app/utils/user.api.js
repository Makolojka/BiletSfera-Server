/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users.
 */

/**
 * @swagger
 * /api/user/auth:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - login
 *               - password
 *     responses:
 *       '200':
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */

/**
 * @swagger
 * /api/user/auth:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - login
 *               - password
 *     responses:
 *       '200':
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */

/**
 * @swagger
 * /api/user/create:
 *   post:
 *     summary: Create a new user
 *     description: Endpoint to register a new user in the system.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             email: user@example.com
 *             password: pass@123
 *     responses:
 *       '200':
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: 12345
 *               email: user@example.com
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Reason for the bad request
 *             example:
 *               error: Password does not meet the strength criteria.
 */

/**
 * @swagger
 * /api/user/update:
 *   post:
 *     summary: Update an existing user
 *     description: Endpoint to update an existing user's information.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 */

/**
 * @swagger
 * /api/user/preferences/{userId}:
 *   get:
 *     summary: Get user preferences by ID
 *     description: Endpoint to retrieve user preferences by user ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve preferences
 *     responses:
 *       '200':
 *         description: User preferences retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 oneTimeMonitChecked:
 *                   type: boolean
 *                   description: Indicates if one-time monitoring is checked
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Reason for user not found
 *             example:
 *               message: User not found
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Description of the server error
 */

/**
 * @swagger
 * /api/user/{userId}/preferences/onetimemonit:
 *   put:
 *     summary: Update oneTimeMonitChecked flag for a user
 *     description: Endpoint to update the oneTimeMonitChecked flag for a user by user ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to update the oneTimeMonitChecked flag
 *     responses:
 *       '200':
 *         description: oneTimeMonitChecked flag updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Indicates the success of the operation
 *                   example: oneTimeMonitChecked updated successfully
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Reason for user not found
 *                   example: User not found
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Description of the server error
 *                   example: Internal server error
 */

/**
 * @swagger
 * /api/user/logout/{userId}:
 *   delete:
 *     summary: Logout a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to logout
 *     responses:
 *       '200':
 *         description: Logout successful
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
 * /api/user/{userId}/cart/add-tickets/{eventId}/{ticketId}:
 *   post:
 *     summary: Add ticket(s) to user's cart
 *     description: Endpoint to add ticket(s) to a user's cart by user ID, event ID, and ticket ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: Number of tickets to add
 *               chosenSeats:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of chosen seat IDs
 *     responses:
 *       '200':
 *         description: Ticket(s) added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the success of the operation
 *                 user:
 *                   $ref: '#/components/schemas/User'
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
 * /api/user/{userId}/cart/remove-ticket/{eventId}/{ticketId}:
 *   post:
 *     summary: Remove ticket(s) from user's cart
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the event
 *       - in: path
 *         name: ticketId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *             required:
 *               - quantity
 *     responses:
 *       '200':
 *         description: Ticket(s) removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/user/{userId}/cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       '200':
 *         description: User's cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cart:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/user/{userId}/preferences:
 *   get:
 *     summary: Get user's preferences by ID
 *     description: Endpoint to retrieve user's preferences by user ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve preferences
 *     responses:
 *       '200':
 *         description: User's preferences retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates the success of the operation
 *                 preferences:
 *                   type: object
 *                   description: Object containing user preferences
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
 * /api/profile/like-follow/{userId}/{eventId}/{actionType}:
 *   post:
 *     summary: Like or follow an event
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
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
 *         description: Like or follow action successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /api/profile/likes-follows/{userId}/{actionType}:
 *   get:
 *     summary: Get liked or followed events by user
 *     tags: [Users]
 *     parameters:
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
 *         description: List of liked or followed events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */

/**
 * @swagger
 * /api/profile/likes-follows/{userId}:
 *   get:
 *     summary: Get counts of liked and followed events by user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       '200':
 *         description: Counts of liked and followed events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 followedEventsCount:
 *                   type: integer
 *                 likedEventsCount:
 *                   type: integer
 */

/**
 * @swagger
 * /api/profile/check-if-event-liked/{userId}/{eventId}/{actionType}:
 *   post:
 *     summary: Check if user liked or followed an event
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
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
 *         description: Information if user liked or followed the event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isLiked:
 *                   type: boolean
 */

/**
 * @swagger
 * /api/organiser/{userId}:
 *   get:
 *     summary: Get organiser's owned events by ID
 *     description: Endpoint to retrieve organiser's owned events by organiser ID.
 *     tags: [Organiser]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the organiser to retrieve owned events
 *     responses:
 *       '200':
 *         description: Organiser's owned events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ownedEvents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *                   description: List of events owned by the organizer
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
 * /api/organiser/{userId}/add-event/{eventId}:
 *   post:
 *     summary: Add event to organiser's ownedEvents
 *     description: Endpoint to add an event to an organiser's ownedEvents by organiser ID and event ID.
 *     tags: [Organiser]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the organiser to add the event
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to add
 *     responses:
 *       '200':
 *         description: Event added to organiser's ownedEvents successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Indicates the success of the operation
 *                   example: Event added to organiser's ownedEvents successfully
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