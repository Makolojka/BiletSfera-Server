import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import mongoConverter from '../service/mongoConverter';
import * as _ from "lodash";
import applicationException from "../service/applicationException";
import TicketDAO from "./ticketDAO";
import UserDAO from "./userDAO";

const eventSchema = new mongoose.Schema({
    // Basic event info
    title: {type: String},
    image: {type: String},
    text: {type: String},
    additionalText: {type: String},
    organiser: {type: String},
    date: {type: String},
    location: {type: String},
    category: { type: [String] },
    subCategory: { type: [String] },
    createdAt: { type: String, default: () => new Date().toISOString() },

    //Tickets array
    tickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tickets'
    }],

    // Room schema
    roomSchema: {
        roomSchema: [
            {
                seats: [
                    {
                        id: { type: String },
                        type: { type: String },
                        color: { type: String },
                        isAvailable: { type: Boolean },
                    },
                ],
            },
        ],
        roomSchemaStyle: { type: String },
    },

    // Artists array
    artists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'artists',
    }],

    // Likes and follows
    likes: { type: [mongoose.Schema.Types.ObjectId] },
    followers: { type: [mongoose.Schema.Types.ObjectId] },

    // Views of one event
    views: { type: Number, default: 0 },

    // Is event active
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    collection: 'events'
});
eventSchema.plugin(uniqueValidator);

const EventModel = mongoose.model('events', eventSchema);

async function query() {
    const result = await EventModel.find({});
    {
        if (result) {
            return mongoConverter(result);
        }
    }
}

async function get(id) {
    return EventModel.findOne({_id: id}).then(function (result) {
        if (result) {
            return mongoConverter(result);
        }
    });
}

async function createNewOrUpdate(data) {
    return Promise.resolve().then(() => {
        if (!data.id) {
            return new EventModel(data).save().then(result => {
                if (result) {
                    return mongoConverter(result);
                }
            });
        } else {
            return EventModel.findByIdAndUpdate(data.id, _.omit(data, 'id'), {new: true});
        }
    });
}

// Followers and Likes
async function addLikeOrFollower(eventId, userId, actionType) {
    try {
        const event = await EventModel.findOne({ _id: eventId });
        if(actionType && actionType==='like'){
            const checkLikes = await EventModel.findOne({ _id: eventId, likes: userId});
            if (event) {
                if(!checkLikes)
                {
                    return EventModel.updateOne({ _id : eventId }, {$push: {likes: userId}}, {new: true})
                }
                else
                {
                    return EventModel.updateOne({ _id : eventId }, {$pull: {likes: userId}})
                }
            } else {
                throw applicationException.new(applicationException.NOT_FOUND, 'Event not found');
            }
        }
        else
        {
            const checkFollows = await EventModel.findOne({ _id: eventId, followers: userId});
            if (event) {
                if(!checkFollows)
                {
                    return EventModel.updateOne({ _id : eventId }, {$push: {followers: userId}}, {new: true})
                }
                else
                {
                    return EventModel.updateOne({ _id : eventId }, {$pull: {followers: userId}})
                }
            } else {
                throw applicationException.new(applicationException.NOT_FOUND, 'Event not found');
            }
        }

    } catch (error) {
        throw error;
    }
}

async function getLikesOrFollowersCount(eventId, actionType, res) {
    try {
        let fieldToCount;

        if (actionType === 'like') {
            fieldToCount = 'likes';
        } else if (actionType === 'follow') {
            fieldToCount = 'followers';
        } else {
            throw new Error('Invalid action. Please provide either "like" or "follow".');
        }

        const event = await EventModel.findById(eventId).select(fieldToCount);

        if (!event) {
            throw new Error('Event not found.');
        }

        const count = event[fieldToCount].length;

        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Increment event views count
async function incrementEventViews(eventId) {
    try {
        const event = await EventModel.findOne({ _id: eventId });
        if (event) {
            const updatedEvent = await EventModel.updateOne(
                { _id: eventId },
                { $inc: { views: 1 } }
            );
            return updatedEvent;
        } else {
            throw new Error('Event not found');
        }
    } catch (error) {
        throw error;
    }
}

// Create event using transaction
async function createEventWithTickets(newEventDetails, ticketIds, session) {
    try {
        newEventDetails.tickets = ticketIds;

        let createdEvent;
        if (!newEventDetails.id) {
            const result = await new EventModel(newEventDetails).save({ session });
            if (result) {
                createdEvent = mongoConverter(result);
            }
        } else {
            const updatedEvent = await EventModel.findByIdAndUpdate(newEventDetails.id, _.omit(newEventDetails, 'id'), { new: true, session });
            if (updatedEvent) {
                createdEvent = mongoConverter(updatedEvent);
            }
        }
        return createdEvent;
    } catch (error) {
        throw new Error('Error creating event: ' + error.message);
    }
}




async function startEventTransaction(newEventDetails) {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const ticketIds = await TicketDAO.createTicketsAndGetIds(newEventDetails.tickets, session);

        const createdEvent = await createEventWithTickets(newEventDetails, ticketIds, session);

        await addEventToOrganizerOwnedEvents(newEventDetails, createdEvent.id, session);

        await session.commitTransaction();
        session.endSession();

        return createdEvent;
    } catch (error) {
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        throw new Error('Transaction aborted: ' + error.message);
    }
}

async function addEventToOrganizerOwnedEvents(newEventDetails, eventId, session) {
    try {
        const organiser = await UserDAO.model.findOne({ name: newEventDetails.organiser }).session(session);

        if (organiser) {
            organiser.ownedEvents.push(eventId);
            await organiser.save();
            return true;
        }
        throw new Error('Organizer not found');
    } catch (error) {
        throw new Error('Error adding event to organizer ownedEvents: ' + error.message);
    }
}

export default {
    query: query,
    get: get,
    createNewOrUpdate: createNewOrUpdate,
    getLikesOrFollowersCount: getLikesOrFollowersCount,
    addLikeOrFollower: addLikeOrFollower,
    incrementEventViews: incrementEventViews,
    startEventTransaction: startEventTransaction,

    model: EventModel
};
