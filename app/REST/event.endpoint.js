import business from '../business/business.container';
import eventDAO from "../DAO/eventDAO";
import applicationException from "../service/applicationException";
import EventDAO from "../DAO/eventDAO";
import UserDAO from "../DAO/userDAO";
import {parseDate} from "../service/dateParserService";

const eventEndpoint = (router) => {
   // Get all events
    router.get('/api/events', async (request, response, next) => {
        try {
            const currentDate = new Date();
            const allEvents = await business.getEventManager().query();

            const activeEvents = allEvents.filter(event => {
                const parsedDate = parseDate(event.date);

                return parsedDate >= currentDate && event.isActive;
            });

            response.status(200).send(activeEvents);
        } catch (error) {
            console.log(error);
            response.status(500).send({ error: 'Failed to retrieve active events.' });
        }
    });

    // Get top 10 events
    router.get('/api/events/most-viewed', async (request, response, next) => {
        try {
            const currentDate = new Date();
            const topEvents = await EventDAO.model.aggregate([
                { $match: { date: { $gte: currentDate } } }, // Filter out events with expired dates
                { $sort: { views: -1 } },
                { $limit: 10 }
            ]);

            response.status(200).send(topEvents);
        } catch (error) {
            console.log(error);
            response.status(500).send({ error: 'Failed to retrieve top active events.' });
        }
    });

    // Get events based on user preferences
    router.get('/api/events/preferences/:userId', async (req, res) => {
        const { userId } = req.params;

        try {
            const user = await UserDAO.model.findOne({ _id: userId }).select('preferences');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const userPreferences = [
                ...user.preferences.selectedCategories,
                ...user.preferences.selectedSubCategories
            ];

            const allEvents = await EventDAO.model.aggregate([
                {
                    $match: {
                        $or: [
                            { category: { $in: userPreferences } },
                            { subCategory: { $in: userPreferences } }
                        ]
                    }
                }
            ]);

            const currentDate = new Date();
            const activeEvents = allEvents.filter(event => {
                const parsedDate = parseDate(event.date);
                return parsedDate >= currentDate;
            });

            res.status(200).json({ matchedEvents: activeEvents });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    //Get a single event
    router.get('/api/events/:id', async (request, response, next) => {
        try{
            let result = await business.getEventManager().query();
            response.status(200).send(result.find(obj => obj.id === request.params.id));
        }catch (error) {
            console.error('Error:', error);
            response.status(500).json({ message: 'Internal server error' });
        }
    });

    // Create a single event //Deprecated
    router.post('/api/event', async (request, response, next) => {
        try {
            let result = await business.getEventManager().createNewOrUpdate(request.body);
            response.status(200).send(result);
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    });

    // Create a single event using transactions
    router.post('/events/transaction', async (req, res) => {
        try {
            const newEventDetails = req.body;

            const createdEvent = await EventDAO.startEventTransaction(newEventDetails);

            res.status(200).json({ message: 'Event and tickets created successfully', event: createdEvent });
        } catch (error) {
            res.status(500).json({ message: 'Error creating event and tickets', error: error.message });
        }
    });

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

    // Get likes and follows
    router.get('/api/event/likes-follows/:eventId/:actionType', async (request, response, next) => {
        try {
            const eventId = request.params.eventId;
            const actionType = request.params.actionType;
            await eventDAO.getLikesOrFollowersCount(eventId, actionType, response);
        } catch (error) {
            response.status(500).json({ error: error.message });
        }
    });

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

    // Event availability change
    router.put('/api/event/deactivate/:eventId', async (req, res) => {
        const eventId = req.params.eventId;
        try {
            const result = await EventDAO.model.updateOne({ _id: eventId }, { $set: { isActive: false } });
            res.json({ success: true, message: 'Event deactivated successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    });

    // Partial update for event
    router.patch('/api/event/update', async (request, response, next) => {
        try {
            const result = await business.getEventManager().createNewOrUpdate(request.body.eventData);
            response.status(200).json(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

};
export default eventEndpoint;
