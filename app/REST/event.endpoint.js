import business from '../business/business.container';

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



};
export default eventEndpoint;
