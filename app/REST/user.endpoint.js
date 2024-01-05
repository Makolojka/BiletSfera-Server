import business from '../business/business.container';
import applicationException from '../service/applicationException';
import organizer from '../middleware/organizer';
import auth from '../middleware/auth';
import userDAO from "../DAO/userDAO";
import eventDAO from "../DAO/eventDAO";
import mongoose from "mongoose";
import UserDAO from "../DAO/userDAO";
const userEndpoint = (router) => {
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
    //Authenticate user
    router.post('/api/user/auth', async (request, response, next) => {
        try {
            let result = await business.getUserManager(request).authenticate(request.body.login, request.body.password);
            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

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
    //Authenticate organiser
    router.post('/api/organizer/auth', async (request, response, next) => {
        try {
            let result = await business.getUserManager(request).authenticateOrganizer(request.body.login, request.body.password);
            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

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
    // Create user
    router.post('/api/user/create', async (request, response, next) => {
        try {
            // Validate the password using the regex
            const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,15}$/;
            if (!strongRegex.test(request.body.password)) {
                response.status(400).json({ error: 'Password does not meet the strength criteria.' });
                return;
            }

            // Proceed with user creation if the password is strong
            const result = await business.getUserManager(request).createNewOrUpdate(request.body);
            response.status(200).json(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

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
    //Update user
    router.post('/api/user/update', async (request, response, next) => {
        console.log("update body: ", request.body)
        try {
            const result = await business.getUserManager(request).createNewOrUpdate(request.body);
            response.status(200).json(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

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
    //Get user preferences
    router.get('/api/user/preferences/:userId', auth, async (req, res) => {
        try {
            const userId = req.params.userId;

            const user = await UserDAO.model.findOne({ _id: userId });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ oneTimeMonitChecked: user.preferences.oneTimeMonitChecked });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    });

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
    // Update the oneTimeMonitChecked flag for a user
    router.put('/api/user/:userId/preferences/onetimemonit', async (req, res) => {
        const { userId } = req.params;

        try {
            const user = await UserDAO.model.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Toggle the oneTimeMonitChecked flag to true
            user.preferences.oneTimeMonitChecked = true;
            await user.save();

            return res.status(200).json({ message: 'oneTimeMonitChecked updated successfully' });
        } catch (error) {
            console.error('Error updating oneTimeMonitChecked:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });


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
    // Logout user
    router.delete('/api/user/logout/:userId', auth, async (request, response, next) => {
        try {
            let result = await business.getUserManager(request).removeHashSession(request.body.userId);
            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

    //Cart
    // Add ticket to cart
    router.post('/api/user/:userId/cart/add-ticket/:eventId/:ticketId', auth, async (req, res) => {
        const { userId, eventId, ticketId } = req.params;
        let { quantity } = req.body;

        // If quantity is not provided or is not a valid number, set it to 1
        if (!quantity || isNaN(quantity)) {
            quantity = 1;
        } else {
            // Ensure quantity is an integer
            quantity = parseInt(quantity);
        }

        try {
            const user = await userDAO.addToCart(userId, eventId, ticketId, quantity);
            res.status(200).json({ success: true, user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

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
    //Cart
    // Add ticket(s) to cart
    router.post('/api/user/:userId/cart/add-tickets/:eventId/:ticketId', auth, async (req, res) => {
        const { userId, eventId, ticketId } = req.params;
        let { quantity, chosenSeats } = req.body;

        console.log("chosenSeats from body: ",chosenSeats)

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Update isAvailable field in roomSchema for chosen seats
            // await userDAO.updateIsAvailableForEventSeats(eventId, chosenSeats, session);

            // Add ticket(s) to cart
            const user = await userDAO.addWithSeatsToCart(userId, eventId, ticketId, quantity, chosenSeats, session);

            await session.commitTransaction();
            session.endSession();

            res.status(200).json({ success: true, user });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            res.status(500).json({ error: error.message });
        }
    });


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
    // Remove ticket(s) from cart
    router.post('/api/user/:userId/cart/remove-ticket/:eventId/:ticketId', auth, async (req, res) => {
        const { userId, eventId, ticketId } = req.params;
        let { quantity } = req.body;

        // If quantity is not provided or is not a valid number, set it to 1
        if (!quantity || isNaN(quantity)) {
            quantity = 1;
        } else {
            // Ensure quantity is an integer
            quantity = parseInt(quantity);
        }

        try {
            const user = await userDAO.removeFromCart(userId, eventId, ticketId, quantity);
            res.status(200).json({ success: true, user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

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
    // Get user's cart
    router.get('/api/user/:userId/cart', auth, async (req, res) => {
        const { userId } = req.params;

        try {
            const cart = await userDAO.getCart(userId);
            res.status(200).json({ success: true, cart });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

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
    // Get user's preferences
    router.get('/api/user/:userId/preferences', auth, async (req, res) => {
        const { userId } = req.params;
        try {
            const preferences = await userDAO.getPreferences(userId);
            res.status(200).json({ success: true, preferences });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

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
    // TODO: dodać auth
    //Likes and follows
    router.post('/api/profile/like-follow/:userId/:eventId/:actionType', async (request, response, next) => {
        try {
            const userId = request.params.userId;
            const eventId = request.params.eventId;
            const actionType = request.params.actionType;
            let result = await userDAO.likeOrFollowEvent(userId, eventId, actionType);

            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

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

    router.get('/api/profile/likes-follows/:userId/:actionType', async (request, response, next) => {
        try {
            const userId = request.params.userId;
            const actionType = request.params.actionType;
            let result = await userDAO.getLikedOrFollowedEvents(userId, actionType)
            response.status(200).send(result);
        } catch (error) {
            console.log(error);
        }
    });

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
    // Get the count of followed and liked events
    router.get('/api/profile/likes-follows/:userId', async (request, response, next) => {
        try {
            const userId = request.params.userId;
            const user = await userDAO.get(userId);

            if (!user) {
                return response.status(404).json({ error: 'User not found' });
            }

            const followedEventsCount = await userDAO.countFollowedEvents(userId);
            const likedEventsCount = await userDAO.countLikedEvents(userId);

            response.status(200).json({
                followedEventsCount: followedEventsCount,
                likedEventsCount: likedEventsCount,
            });
        } catch (error) {
            console.log(error);
            response.status(500).json({ error: 'Internal server error' });
        }
    });

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
    // Check if user liked or followed an event
    router.post('/api/profile/check-if-event-liked/:userId/:eventId/:actionType', async (request, response, next) => {
        try {
            const userId = request.params.userId;
            const eventId = request.params.eventId;
            const actionType = request.params.actionType;
            let result = await userDAO.checkIfEventIsLiked(userId, eventId, actionType);

            response.status(200).send({ isLiked: result });
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });


    // Organisers endpoints
    // TODO: przenieść do osobnego DAO

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
    // Get organiser ownedEvents
    router.get('/api/organizer/:userId', auth, async (req, res) => {
        const { userId } = req.params;

        try {
            const ownedEvents = await userDAO.getOwnedEvents(userId);
            res.status(200).json({ ownedEvents });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    });

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
    // Add event to organizer's ownedEvents
    router.post('/api/organizer/:userId/add-event/:eventId', auth, async (req, res) => {
        const { userId, eventId } = req.params;

        try {
            await userDAO.addEventToOwnedEvents(userId, eventId);
            res.status(200).json({ message: 'Event added to organizer\'s ownedEvents successfully.' });
        } catch (error) {
            applicationException.errorHandler(error, res);
        }
    });

};
export default userEndpoint;
