import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import mongoConverter from '../service/mongoConverter';
import * as _ from "lodash";
import {ObjectId} from "mongodb";

const ticketSchema = new mongoose.Schema({
    type: { type: String },
    price: { type: Number },
    dayOfWeek: { type: String },
    date: { type: String },
});

const eventSchema = new mongoose.Schema({
    // Basic event info
    title: {type: String},
    image: {type: String},
    text: {type: String},
    tickets: [ticketSchema],
    date: {type: String},
    location: {type: String},

    // Likes and follows
    likedEvents: {type: [ObjectId]},
    followedEvents:  {type: [ObjectId]},

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
