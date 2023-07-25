'use strict';

import userManager from './user.manager';
import postManager from './post.manager';
import eventManager from "./event.manager";
import artistManager from "./artist.manager";


function getter(manager, request) {
    return function () {
        return manager.create(request, this);
    };
}

export default {
    getUserManager: getter(userManager),
    getPostManager: getter(postManager),
    getEventManager: getter(eventManager),
    getArtistManager: getter(artistManager)
};
