import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import mongoConverter from '../service/mongoConverter';
import * as _ from "lodash";
import {ObjectId} from "mongodb";

// //TODO: przerobić ticket na kolekcję
// const ticketSchema = new mongoose.Schema({
//     type: { type: String },
//     price: { type: Number },
//     dayOfWeek: { type: String },
//     date: { type: String },
// });
// const TicketModel = mongoose.model('tickets', ticketSchema);

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

    // Artists array
    artists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'artists',
    }],

    // Likes and follows
    likedEvents: { type: [mongoose.Schema.Types.ObjectId] },
    followedEvents: { type: [mongoose.Schema.Types.ObjectId] },

    // Views of one event
    views: { type: Number, default: 0 },
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
                if (result[0]) {
                    return mongoConverter(result[0]);
                }
            });
        } else {
            return EventModel.findByIdAndUpdate(data.id, _.omit(data, 'id'), {new: true});
        }
    });
}

export default {
    query: query,
    get: get,
    createNewOrUpdate: createNewOrUpdate,

    model: EventModel
};
