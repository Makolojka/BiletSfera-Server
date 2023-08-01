import business from '../business/business.container';
import applicationException from '../service/applicationException';
import admin from '../middleware/admin';
import auth from '../middleware/auth';
import userDAO from "../DAO/userDAO";
import eventDAO from "../DAO/eventDAO";
const userEndpoint = (router) => {
    router.post('/api/user/auth', async (request, response, next) => {
        try {
            let result = await business.getUserManager(request).authenticate(request.body.login, request.body.password);
            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

    router.post('/api/user/create', async (request, response, next) => {
        try {
            const result = await business.getUserManager(request).createNewOrUpdate(request.body);
            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

    router.delete('/api/user/logout/:userId', auth, async (request, response, next) => {
        try {
            let result = await business.getUserManager(request).removeHashSession(request.body.userId);
            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

    //Cart
    // Add ticket(s) to cart
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

    // TODO: dodać auth
    //Likes and follows
    router.post('/api/profile/:userId/:actionType', async (request, response, next) => {
        try {
            const userId = request.params.userId;
            const actionType = request.params.actionType;
            const eventId = request.body.eventId;
            let result = await userDAO.likeOrFollowEvent(userId, eventId, actionType);

            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

    router.get('/api/profile/:userId/:actionType', async (request, response, next) => {
        try {
            const userId = request.params.userId;
            const actionType = request.params.actionType;
            let result = await userDAO.getLikedOrFollowedEvents(userId, actionType)
            response.status(200).send(result);
        } catch (error) {
            console.log(error);
        }
    });

};
export default userEndpoint;
