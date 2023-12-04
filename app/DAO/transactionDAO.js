import mongoose from 'mongoose';
import mongoConverter from '../service/mongoConverter';
import * as _ from "lodash";
const ObjectId = mongoose.Types.ObjectId;
import eventDAO from "../DAO/eventDAO";
const EventModel = eventDAO.model;

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId },
    tickets: [{
        ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'tickets' },
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'events' },
        count: { type: Number},
        singleTicketCost: { type: Number }
    }],
    saleDate: { type: Date, default: Date.now },
    totalCost: { type: Number },
});

const TransactionModel = mongoose.model('transaction', transactionSchema);

async function query() {
    const result = await TransactionModel.find({});
    {
        if (result) {
            return mongoConverter(result);
        }
    }
}

async function get(id) {
    return TransactionModel.findOne({_id: id}).then(function (result) {
        if (result) {
            return mongoConverter(result);
        }
    });
}

async function createNewOrUpdate(data) {
    return Promise.resolve().then(() => {
        if (!data.id) {
            return new TransactionModel(data).save().then(result => {
                if (result[0]) {
                    return mongoConverter(result[0]);
                }
            });
        } else {
            return TransactionModel.findByIdAndUpdate(data.id, _.omit(data, 'id'), {new: true});
        }
    });
}

// async function getTransactionsForEvent(eventId) {
//     try {
//         const count = await TransactionModel.countDocuments({'tickets.eventId': eventId});
//         console.log("transactions count:",count)
//     } catch (error) {
//         console.error('Error in getTransactionsForEvent:', error);
//         throw error;
//     }
// }
async function getTransactionsForEvent(eventId) {
    try {
        const eventObjectId = ObjectId(eventId);

        const result = await TransactionModel.aggregate([
            {
                $match: {
                    'tickets.eventId': eventObjectId
                }
            },
            {
                $unwind: '$tickets'
            },
            {
                $match: {
                    'tickets.eventId': eventObjectId
                }
            },
            {
                $group: {
                    _id: null,
                    totalCount: { $sum: '$tickets.count' }
                }
            }
        ]);

        if (result.length > 0) {
            return result[0].totalCount;
        } else {
            return 0;
        }
    } catch (error) {
        console.error('Error in countTicketsForEvent:', error);
        throw error;
    }
}

async function countTicketsSoldForOrganiser(organiserName) {
    try {
        // Step 1: Find events by the organizer
        // const eventsByOrganiser = await EventModel.find({organiser: organiserName}); find({organiser:/organiserName/})
        // const eventsByOrganiser = await EventModel.find({"organiser" : {$regex : organiserName}});
        // console.log("eventsByOrganiser: ")
        const eventsByOrganiser = await EventModel.find({ organiser: organiserName });
        // Step 2: Retrieve tickets from events and convert them to ObjectId
        const eventTickets = eventsByOrganiser.reduce((tickets, event) => {
            return tickets.concat(event.tickets.map(ticketId => ObjectId(ticketId)));
        }, []);

        // Step 3: Match transactions by tickets
        const result = await TransactionModel.aggregate([
            {
                $match: {
                    'tickets.ticketId': { $in: eventTickets } // Match transactions with tickets from the organizer's events
                }
            },
            {
                $unwind: '$tickets' // Unwind the tickets array
            },
            {
                $match: {
                    'tickets.ticketId': { $in: eventTickets } // Match again to filter by ticketIds
                }
            },
            {
                $group: {
                    _id: null,
                    totalCount: { $sum: '$tickets.count' } // Calculate the total count of tickets
                }
            }
        ]);

        if (result.length > 0) {
            return result[0].totalCount; // Return the total count of tickets sold for the organizer
        } else {
            return 0; // Return 0 if no matching transactions found for the organizer
        }
    } catch (error) {
        console.error('Error in countTicketsSoldForOrganiser:', error);
        throw error;
    }
}

// async function calculateTotalEarningsForOrganiser(organiserName) {
//     try {
//         // Step 1: Find events by the organizer's name
//         const eventsByOrganiser = await EventModel.find({ organiser: organiserName });
//         console.log("eventsByOrganiser: ",eventsByOrganiser)
//
//         // Step 2: Retrieve tickets from events and convert them to ObjectId
//         const eventTickets = eventsByOrganiser.reduce((tickets, event) => {
//             return tickets.concat(event.tickets.map(ticketId => ObjectId(ticketId)));
//         }, []);
//
//         console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!eventTickets: ",eventTickets)
//
//         // Step 3: Match transactions by tickets
//         const transactions = await TransactionModel.find({ 'tickets.ticketId': { $in: eventTickets } });
//         console.log("transactions: ",transactions)
//
//         // Step 4: Calculate total earnings for the organizer
//         let totalEarningsForOrganiser = 0;
//         transactions.forEach(transaction => {
//             transaction.tickets.forEach(ticket => {
//                 totalEarningsForOrganiser += ticket.singleTicketCost * ticket.count;
//             });
//         });
//         console.log("totalEarningsForOrganiser: ",totalEarningsForOrganiser)
//         return totalEarningsForOrganiser;
//     } catch (error) {
//         console.error('Error in calculateTotalEarningsForOrganiser:', error);
//         throw error;
//     }
// }
// async function calculateTotalEarningsForOrganiser(organiserName) {
//     try {
//         // Step 1: Find events by the organizer's name
//         const eventsByOrganiser = await EventModel.find({ organiser: organiserName });
//
//         // Step 2: Retrieve tickets from events and convert them to ObjectId
//         const eventTickets = eventsByOrganiser.reduce((tickets, event) => {
//             return tickets.concat(event.tickets.map(ticketId => ObjectId(ticketId)));
//         }, []);
//         console.log("eventTickets: ",eventTickets)
//
//         // Step 3: Find transactions for tickets linked to events of the organizer
//         const transactions = await TransactionModel.find({
//             'tickets.ticketId': { $in: eventTickets }
//         });
//         console.log("transactions: ",transactions)
//
//         // Step 4: Calculate total earnings for the organizer
//         let totalEarningsForOrganiser = 0;
//
//         transactions.forEach(transaction => {
//             transaction.tickets.forEach(ticket => {
//                 console.log("ticket.ticketId in if:",ticket.ticketId)
//                 console.log("type of ticket.ticketId in if:",typeof ticket.ticketId)
//                 console.log("type of eventTickets in if:",typeof eventTickets)
//                 if (eventTickets.includes(String(ticket.ticketId))) {
//                     totalEarningsForOrganiser += ticket.singleTicketCost * ticket.count;
//                 }
//             });
//         });
//
//         return totalEarningsForOrganiser;
//     } catch (error) {
//         console.error('Error in calculateTotalEarningsForOrganiser:', error);
//         throw error;
//     }
// }

async function calculateTotalEarningsForOrganiser(organiserName) {
    try {
        // Step 1: Find events by the organizer's name
        const eventsByOrganiser = await EventModel.find({ organiser: organiserName });

        console.log("eventsByOrganiser: ",eventsByOrganiser)
        // Step 2: Retrieve tickets from events and convert them to ObjectId strings
        const eventTickets = eventsByOrganiser.reduce((tickets, event) => {
            return tickets.concat(event.tickets.map(ticketId => String(ticketId)));
        }, []);
        console.log("eventTickets: ",eventTickets)
        // Step 3: Find transactions for tickets linked to events of the organizer
        const transactions = await TransactionModel.find({
            'tickets.ticketId': { $in: eventTickets }
        });
        console.log("transactions: ",transactions)
        // Step 4: Calculate total earnings for the organizer
        let totalEarningsForOrganiser = 0;

        transactions.forEach(transaction => {
            transaction.tickets.forEach(ticket => {
                const ticketIdString = String(ticket.ticketId);
                if (eventTickets.includes(ticketIdString)) {
                    totalEarningsForOrganiser += ticket.singleTicketCost * ticket.count;
                }
            });
        });
        console.log("totalEarningsForOrganiser: ",totalEarningsForOrganiser)

        return totalEarningsForOrganiser;
    } catch (error) {
        console.error('Error in calculateTotalEarningsForOrganiser:', error);
        throw error;
    }
}



export default {
    query: query,
    get: get,
    createNewOrUpdate: createNewOrUpdate,
    getTransactionsForEvent: getTransactionsForEvent,
    countTicketsSoldForOrganiser: countTicketsSoldForOrganiser,
    calculateTotalEarningsForOrganiser: calculateTotalEarningsForOrganiser,

    model: TransactionModel
};

