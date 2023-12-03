import mongoose from 'mongoose';
import mongoConverter from '../service/mongoConverter';
import * as _ from "lodash";
const ObjectId = mongoose.Types.ObjectId;

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId },
    tickets: [{
        ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'tickets' },
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'events' },
        count: { type: Number}
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









export default {
    query: query,
    get: get,
    createNewOrUpdate: createNewOrUpdate,
    getTransactionsForEvent: getTransactionsForEvent,

    model: TransactionModel
};

