import business from '../business/business.container';
import applicationException from '../service/applicationException';
import auth from '../middleware/auth';
import userDAO from "../DAO/userDAO";
import mongoose from "mongoose";
import UserDAO from "../DAO/userDAO";
const userEndpoint = (router) => {
    //Authenticate user
    router.post('/api/user/auth', async (request, response, next) => {
        try {
            let result = await business.getUserManager(request).authenticate(request.body.login, request.body.password);
            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

    //Authenticate organiser
    router.post('/api/organizer/auth', async (request, response, next) => {
        try {
            let result = await business.getUserManager(request).authenticateOrganizer(request.body.login, request.body.password);
            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

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

    //Update user
    router.post('/api/user/update', async (request, response, next) => {
        try {
            const result = await business.getUserManager(request).createNewOrUpdate(request.body);
            response.status(200).json(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

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

    //Cart
    // Add ticket(s) to cart
    router.post('/api/user/:userId/cart/add-tickets/:eventId/:ticketId', auth, async (req, res) => {
        const { userId, eventId, ticketId } = req.params;
        let { quantity, chosenSeats } = req.body;
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
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

    //Get liked or followed event
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
