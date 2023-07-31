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
    router.post('/api/user/:userId/cart/add-ticket/:eventId/:ticketId', async (req, res) => {
        const { userId, eventId, ticketId } = req.params;
        const { quantity } = req.body;

        try {
            const user = await userDAO.addToCart(userId, eventId, ticketId, quantity);
            res.status(200).json({ success: true, user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/api/user/:userId/cart/remove-ticket/:eventId/:ticketId', async (req, res) => {
        const { userId, eventId, ticketId } = req.params;

        try {
            const user = await userDAO.removeFromCart(userId, eventId, ticketId);
            res.status(200).json({ success: true, user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/api/user/:userId/cart', async (req, res) => {
        const { userId } = req.params;

        try {
            const cart = await userDAO.getCart(userId);
            res.status(200).json({ success: true, cart });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};
export default userEndpoint;
