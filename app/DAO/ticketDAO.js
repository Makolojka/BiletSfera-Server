import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import mongoConverter from '../service/mongoConverter';
import * as _ from "lodash";
import {ObjectId} from "mongodb";
import ApplicationException from "../service/applicationException";
import applicationException from "../service/applicationException";

const ticketSchema = new mongoose.Schema({
    type: { type: String },
    price: { type: Number },
    dayOfWeek: { type: String },
    date: { type: String },
    color: { type: String },
    maxNumberOfTickets: { type: Number },
    availableTickets: { type: Number },
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
                if (result) {
                    return mongoConverter(result);
                }
            });
        } else {
            return TicketModel.findByIdAndUpdate(data.id, _.omit(data, 'id'), {new: true});
        }
    });
}

async function createTicketsAndGetIds(tickets, session) {
    const ticketIds = [];
    for (const ticket of tickets) {
        const createdTicket = await createTicketAndGetId(ticket, session);
        ticketIds.push(createdTicket._id);
    }
    console.log("ticketIds in createTicketsAndGetIds: ", ticketIds)
    return ticketIds;
}

async function createTicketAndGetId(ticket, session) {
    const createdTicket = await TicketModel.create([ticket], { session });
    console.log("createdTicket in createTicketAndGetId: ", createdTicket)
    return createdTicket[0]._id;
}

async function decreaseMaxTickets (ticketId, count, session){
    try {
        const ticket = await TicketModel.findById(ticketId).session(session);
        if (!ticket) {
            throw applicationException.new(applicationException.NOT_FOUND, 'Ticket not found');
        } else if (ticket.maxNumberOfTickets !== undefined) {
            ticket.maxNumberOfTickets -= count;
            await ticket.save();
        }
    } catch (error) {
        throw error;
    }
}

export default {
    query: query,
    get: get,
    createNewOrUpdate: createNewOrUpdate,
    createTicketsAndGetIds: createTicketsAndGetIds,
    createTicketAndGetId: createTicketAndGetId,
    decreaseMaxTickets: decreaseMaxTickets,

    model: TicketModel
};

