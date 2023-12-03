import userEndpoint from './user.endpoint';
import postEndpoint from './post.endpoint';
import eventEndpoint from './event.endpoint';
import artistEndpoint from './artist.endpoint';
import ticketEndpoint from './ticket.endpoint';
import transactionEndpoint from './transaction.endpoint';

const routes = function (router) {
    userEndpoint(router);
    postEndpoint(router);
    eventEndpoint(router);
    artistEndpoint(router);
    ticketEndpoint(router);
    transactionEndpoint(router);
};

export default routes;
