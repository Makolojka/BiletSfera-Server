import business from '../business/business.container';
import eventDAO from "../DAO/eventDAO";
import artistDAO from "../DAO/artistDAO";
const artistEndpoint = (router) => {
    // Get all artists
    router.get('/api/artists', async (request, response, next) => {
        try {
            let result = await business.getArtistManager().query();
            response.status(200).send(result);
        } catch (error) {
            console.log(error);
        }
    });

    //Get a single artist
    router.get('/api/artists/:id', async (request, response, next) => {
        let result = await business.getArtistManager().query();
        response.status(200).send(result.find(obj => obj.id === request.params.id));
    });

    // Create a single artist
    router.post('/api/artist', async (request, response, next) => {
        try {
            let result = await business.getArtistManager().createNewOrUpdate(request.body);
            response.status(200).send(result);``
        } catch (error) {
            console.log(error);
        }
    });

    // Returns artists objects that participate in given event
    router.get('/api/events/:id/artists', async (request, response, next) => {
        try {
            const eventId = request.params.id;
            const event = await eventDAO.get(eventId);

            if (!event) {
                return response.status(404).json({ error: 'Event not found' });
            }

            const artistIds = event.artists;

            // Fetch the artists using the artistIds array and populate their details
            const artists = await artistDAO.model.find({ _id: { $in: artistIds } });

            response.status(200).json(artists);
        } catch (error) {
            console.log(error);
            response.status(500).json({ error: 'Internal server error' });
        }
    });

};
export default artistEndpoint;
