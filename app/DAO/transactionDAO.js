import mongoose from 'mongoose';
import mongoConverter from '../service/mongoConverter';
import * as _ from "lodash";
import eventDAO from "../DAO/eventDAO";
import userDAO from "../DAO/userDAO";
import ticketDAO from "./ticketDAO";
import applicationException from "../service/applicationException";
import UserDAO from "../DAO/userDAO";

const ObjectId = mongoose.Types.ObjectId;
const EventModel = eventDAO.model;

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId },
    tickets: [{
        ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'tickets' },
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'events' },
        count: { type: Number},
        singleTicketCost: { type: Number },
        seatNumbers: [{ type: String, required: false }]
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

async function getAllTransactionsByUserId(userId) {
    try {
        const user = await UserDAO.model.findOne({ _id: userId });
        if (!user) {
            throw applicationException.new(applicationException.NOT_FOUND, 'User not found');
        }

        const result = await TransactionModel.find({ userId: userId });
        if (result) {
            return mongoConverter(result);
        }
        return [];
    } catch (error) {
        throw error;
    }
}

async function createNewOrUpdate(data) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const result = await new TransactionModel(data).save({ session });
        await userDAO.clearUserCart(data.userId, session);
        // Decrease maxNumberOfTickets for each purchased ticket
        for (const ticketData of data.tickets) {
            await ticketDAO.decreaseMaxTickets(ticketData.ticketId, ticketData.count, session);
        }

        await session.commitTransaction();
        session.endSession();
        return mongoConverter(result);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

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
        // Find events by the organizer
        const eventsByOrganiser = await EventModel.find({ organiser: organiserName });

        // Retrieve tickets from events and convert them to ObjectId
        const eventTickets = eventsByOrganiser.reduce((tickets, event) => {
            return tickets.concat(event.tickets.map(ticketId => ObjectId(ticketId)));
        }, []);

        // Match transactions by tickets
        const result = await TransactionModel.aggregate([
            {
                $match: {
                    'tickets.ticketId': { $in: eventTickets }
                }
            },
            {
                $unwind: '$tickets'
            },
            {
                $match: {
                    'tickets.ticketId': { $in: eventTickets }
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
        console.error('Error in countTicketsSoldForOrganiser:', error);
        throw error;
    }
}

async function calculateTotalEarningsForOrganiser(organiserName) {
    try {
        // Find events by the organizer's name
        const eventsByOrganiser = await EventModel.find({ organiser: organiserName });

        // Retrieve tickets from events and convert them to ObjectId strings
        const eventTickets = eventsByOrganiser.reduce((tickets, event) => {
            return tickets.concat(event.tickets.map(ticketId => String(ticketId)));
        }, []);

        // Find transactions for tickets linked to events of the organizer
        const transactions = await TransactionModel.find({
            'tickets.ticketId': { $in: eventTickets }
        });

        // Calculate total earnings for the organizer
        let totalEarningsForOrganiser = 0;

        transactions.forEach(transaction => {
            transaction.tickets.forEach(ticket => {
                const ticketIdString = String(ticket.ticketId);
                if (eventTickets.includes(ticketIdString)) {
                    totalEarningsForOrganiser += ticket.singleTicketCost * ticket.count;
                }
            });
        });

        return totalEarningsForOrganiser;
    } catch (error) {
        console.error('Error in calculateTotalEarningsForOrganiser:', error);
        throw error;
    }
}

async function calculateTotalEarningsForEvent(eventId) {
    try {
        const ObjectId = mongoose.Types.ObjectId;

        // Find transactions for the specific event
        const transactionsForEvent = await TransactionModel.find({ 'tickets.eventId': ObjectId(eventId) });

        // Calculate total earnings for the event
        let totalEarningsForEvent = 0;
        transactionsForEvent.forEach(transaction => {
            transaction.tickets.filter(ticket => ticket.eventId.equals(ObjectId(eventId))).forEach(ticket => {
                totalEarningsForEvent += ticket.singleTicketCost * ticket.count;
            });
        });

        return totalEarningsForEvent;
    } catch (error) {
        console.error('Error in calculateTotalEarningsForEvent:', error);
        throw error;
    }
}

async function calculateTotalViewsForOrganiser(organiserName) {
    try {
        // Find events by organiser
        const eventsByOrganiser = await EventModel.find({ organiser: organiserName });

        // Calculate total views
        let totalViews = 0;
        eventsByOrganiser.forEach(event => {
            totalViews += event.views || 0;
        });

        return totalViews;
    } catch (error) {
        console.error('Error in calculateTotalViewsForOrganiser:', error);
        throw error;
    }
}

async function getSaleDataForOrganiser(organiserName) {
    try {
        // Find events by the organizer's name
        const eventsByOrganiser = await EventModel.find({ organiser: organiserName });

        // Extract ticket IDs from events
        const eventTicketIds = eventsByOrganiser.reduce((ticketIds, event) => {
            return ticketIds.concat(event.tickets.map(ticketId => mongoose.Types.ObjectId(ticketId)));
        }, []);

        // Find transactions for tickets linked to events of the organizer
        const transactions = await TransactionModel.aggregate([
            {
                $match: {
                    'tickets.ticketId': { $in: eventTicketIds }
                }
            },
            {
                $unwind: '$tickets'
            },
            {
                $match: {
                    'tickets.ticketId': { $in: eventTicketIds }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$saleDate'
                        }
                    },
                    totalSold: {
                        $sum: '$tickets.count'
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: 'Bilety',
                    series: [
                        {
                            name: '$_id',
                            value: '$totalSold'
                        }
                    ]
                }
            }
        ]);

        return transactions;
    } catch (error) {
        console.error('Error fetching sale data:', error);
        throw error;
    }
}

async function updateIsAvailableForEventSeats(eventId, chosenSeats, session) {
    try {
        const event = await EventModel.findById(eventId).session(session);

        if (!event) {
            throw new Error('Event not found');
        }
        const roomSchema = event.roomSchema.roomSchema;

        for (const chosenSeat of chosenSeats) {
            const parsedSeat = chosenSeat.replace(/\.$/, ''); // Parse the seat string
            const [frontendRowIndex, frontendColIndex] = parsedSeat.split('.').map(Number); // Split seat ID into row and column

            // Convert frontend indices to backend indices
            const backendRowIndex = frontendRowIndex - 1;
            const backendColIndex = frontendColIndex - 1;

            for (const room of roomSchema) {
                const seat = room.seats.find(seat => {
                    // Adjust the seat indexing to match the database's indexing
                    const [dbRowIndex, dbColIndex] = seat.id.split('.').map(Number);
                    return dbRowIndex === backendRowIndex && dbColIndex === backendColIndex;
                });

                if (seat) {
                    seat.isAvailable = false;
                    break;
                }
            }
        }
        await event.save();
    } catch (error) {
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
    calculateTotalEarningsForEvent: calculateTotalEarningsForEvent,
    calculateTotalViewsForOrganiser: calculateTotalViewsForOrganiser,
    getSaleDataForOrganiser: getSaleDataForOrganiser,
    getAllTransactionsByUserId: getAllTransactionsByUserId,
    updateIsAvailableForEventSeats: updateIsAvailableForEventSeats,

    model: TransactionModel
};

