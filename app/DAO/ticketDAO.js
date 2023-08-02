import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import mongoConverter from '../service/mongoConverter';
import * as _ from "lodash";
import {ObjectId} from "mongodb";

//TODO: Dodać liczbę dostepnych biletów
const ticketSchema = new mongoose.Schema({
    type: { type: String },
    price: { type: Number },
    dayOfWeek: { type: String },
    date: { type: String },
});
const TicketModel = mongoose.model('tickets', ticketSchema);

async function query() {
    const result = await TicketModel.find({});
    {
        if (result) {
            return mongoConverter(result);
        }
    }
}

async function get(id) {
    return TicketModel.findOne({_id: id}).then(function (result) {
        if (result) {
            return mongoConverter(result);
        }
    });
}

async function createNewOrUpdate(data) {
    return Promise.resolve().then(() => {
        if (!data.id) {
            return new TicketModel(data).save().then(result => {
                if (result[0]) {
                    return mongoConverter(result[0]);
                }
            });
        } else {
            return TicketModel.findByIdAndUpdate(data.id, _.omit(data, 'id'), {new: true});
        }
    });
}

export default {
    query: query,
    get: get,
    createNewOrUpdate: createNewOrUpdate,

    model: TicketModel
};

