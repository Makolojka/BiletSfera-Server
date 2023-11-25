import business from '../business/business.container';
import eventDAO from "../DAO/eventDAO";
import artistDAO from "../DAO/artistDAO";
const artistEndpoint = (router) => {
    /**
     * @swagger
     * tags:
     *   name: Artists
     *   description: API for managing artists.
     */

    /**
     * @swagger
     * /api/artists:
     *   get:
     *     summary: Get all artists
     *     tags: [Artists]
     *     responses:
     *       200:
     *         description: Successful response
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Artist'
     *       500:
     *         description: Internal server error
     */
    // Get all artists
    router.get('/api/artists', async (request, response, next) => {
        try {
            let result = await business.getArtistManager().query();
            response.status(200).send(result);
        } catch (error) {
            console.log(error);
        }
    });

    /**
     * @swagger
     * /api/artists/{id}:
     *   get:
     *     summary: Get a single artist by ID
     *     tags: [Artists]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the artist
     *     responses:
     *       200:
     *         description: Successful response
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Artist'
     *       404:
     *         description: Artist not found
     */
    //Get a single artist
    router.get('/api/artists/:id', async (request, response, next) => {
        let result = await business.getArtistManager().query();
        response.status(200).send(result.find(obj => obj.id === request.params.id));
    });

    /**
     * @swagger
     * /api/artist:
     *   post:
     *     summary: Create a single artist
     *     tags: [Artists]
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Artist'
     *     responses:
     *       200:
     *         description: Successful response
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Artist'
     */
    // Create a single artist
    router.post('/api/artist', async (request, response, next) => {
        try {
            let result = await business.getArtistManager().createNewOrUpdate(request.body);
            response.status(200).send(result);``
        } catch (error) {
            console.log(error);
        }
    });

    /**
     * @swagger
     * /api/events/{id}/artists:
     *   get:
     *     summary: Returns artists objects that participate in given event
     *     tags: [Artists]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the event
     *     responses:
     *       200:
     *         description: Successful response
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Artist'
     *       404:
     *         description: Event not found
     *       500:
     *         description: Internal server error
     */
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
