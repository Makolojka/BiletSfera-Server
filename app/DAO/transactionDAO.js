import mongoose from 'mongoose';
import mongoConverter from '../service/mongoConverter';
import * as _ from "lodash";

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId },
    tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tickets' }],
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

export default {
    query: query,
    get: get,
    createNewOrUpdate: createNewOrUpdate,

    model: TransactionModel
};

