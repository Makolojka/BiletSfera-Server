import userEndpoint from './user.endpoint';
import postEndpoint from './post.endpoint';
import eventEndpoint from "./event.endpoint";

const routes = function (router) {
    userEndpoint(router);
    postEndpoint(router);
    eventEndpoint(router);
};

export default routes;
