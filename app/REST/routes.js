import userEndpoint from './user.endpoint';
import postEndpoint from './post.endpoint';
import eventEndpoint from "./event.endpoint";
import artistEndpoint from "./artist.endpoint";

const routes = function (router) {
    userEndpoint(router);
    postEndpoint(router);
    eventEndpoint(router);
    artistEndpoint(router);
};

export default routes;
