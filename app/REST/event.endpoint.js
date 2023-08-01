import business from '../business/business.container';
import eventDAO from "../DAO/eventDAO";
import userDAO from "../DAO/userDAO";
import applicationException from "../service/applicationException";

const eventEndpoint = (router) => {
    // Get all events
    router.get('/api/events', async (request, response, next) => {
        try {
            let result = await business.getEventManager().query();
            response.status(200).send(result);
        } catch (error) {
            console.log(error);
        }
    });

    //Get a single event
    router.get('/api/events/:id', async (request, response, next) => {
        let result = await business.getEventManager().query();
        response.status(200).send(result.find(obj => obj.id === request.params.id));
    });

    // Create a single event
    router.post('/api/event', async (request, response, next) => {
        try {
            let result = await business.getEventManager().createNewOrUpdate(request.body);
            response.status(200).send(result);
        } catch (error) {
            console.log(error);
        }
    });
    // TODO: Lepiej przesyłać przez parametry czy przez body?
    // Get Likes or followers
    router.post('/api/event/likes-follows/:userId/:actionType', async (request, response, next) => {
        try {
            const userId = request.params.userId;
            const actionType = request.params.actionType;
            const eventId = request.body.eventId;
            let result = await eventDAO.addLikeOrFollower(eventId, userId, actionType);

            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

    router.get('/api/event/:eventId/follow-likes/:actionType', async (request, response, next) => {
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


};
export default eventEndpoint;
