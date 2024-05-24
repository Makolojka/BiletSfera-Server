'use strict';

import userManager from './user.manager';
import eventManager from "./event.manager";
import artistManager from "./artist.manager";
import ticketManager from "./ticket.manager";
import transactionManager from "./transaction.manager";


function getter(manager, request) {
    return function () {
        return manager.create(request, this);
    };
}

export default {
    getUserManager: getter(userManager),
    getEventManager: getter(eventManager),
    getArtistManager: getter(artistManager),
    getTicketManager: getter(ticketManager),
    getTransactionManager: getter(transactionManager)
};
