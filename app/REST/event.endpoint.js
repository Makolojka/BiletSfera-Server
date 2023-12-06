import business from '../business/business.container';
import eventDAO from "../DAO/eventDAO";
import userDAO from "../DAO/userDAO";
import applicationException from "../service/applicationException";
import mongoose from "mongoose";
import EventDAO from "../DAO/eventDAO";

const eventEndpoint = (router) => {
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
    // Get all events
    router.get('/api/events', async (request, response, next) => {
        try {
            let result = await business.getEventManager().query();
            response.status(200).send(result);
        } catch (error) {
            console.log(error);
        }
    });

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
    //Get a single event
    router.get('/api/events/:id', async (request, response, next) => {
        let result = await business.getEventManager().query();
        response.status(200).send(result.find(obj => obj.id === request.params.id));
    });

    /**
     * @swagger
     * /api/event:
     *   post:
     *     summary: Create a new event
     *     tags: [Events]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Event'
     *     responses:
     *       '200':
     *         description: The created event
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Event'
     */
    // Create a single event
    router.post('/api/event', async (request, response, next) => {
        try {
            let result = await business.getEventManager().createNewOrUpdate(request.body);
            response.status(200).send(result);
        } catch (error) {
            console.log(error);
        }
    });

    // Create a single event using transactions
    router.post('/events/transaction', async (req, res) => {
        try {
            const newEventDetails = req.body;
            console.log("newEventDetails: ",newEventDetails)

            const createdEvent = await EventDAO.startEventTransaction(newEventDetails);

            res.status(200).json({ message: 'Event and tickets created successfully', event: createdEvent });
        } catch (error) {
            res.status(500).json({ message: 'Error creating event and tickets', error: error.message });
        }
    });

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
    // Like or follows event
    router.post('/api/event/likes-follows/:eventId/:userId/:actionType', async (request, response, next) => {
        try {
            const eventId = request.params.eventId;
            const userId = request.params.userId;
            const actionType = request.params.actionType;
            let result = await eventDAO.addLikeOrFollower(eventId, userId, actionType);

            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

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
    // Get likes and followes
    router.get('/api/event/likes-follows/:eventId/:actionType', async (request, response, next) => {
        try {
            const eventId = request.params.eventId;
            const actionType = request.params.actionType;

            // Call the function to get the count and pass the response object to it
            await eventDAO.getLikesOrFollowersCount(eventId, actionType, response);
        } catch (error) {
            // Handle errors and send an error response
            response.status(500).json({ error: error.message });
        }
    });

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
    // TODO: zmienić, żeby zapisywało unikalnych użytkowników, którzy kliknęli event
    //Update views for an event
    router.post('/api/event/views/:eventId', async (request, response) => {
        try {
            const eventId = request.params.eventId;
            const result = await eventDAO.incrementEventViews(eventId);

            if (!result) {
                return response.status(404).json({ error: 'Event not found' });
            }

            response.status(200).json({ message: 'Event views incremented successfully' });
        } catch (error) {
            response.status(500).json({ error: 'Internal server error' });
        }
    });

};
export default eventEndpoint;
