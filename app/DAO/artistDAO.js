import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import mongoConverter from '../service/mongoConverter';
import * as _ from "lodash";

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    shortDescription: {
        type: String,
        required: true,
    },
    career: {
        type: String,
    },
});
artistSchema.plugin(uniqueValidator);

const ArtistModel = mongoose.model('artists', artistSchema);

async function query() {
    const result = await ArtistModel.find({});
    {
        if (result) {
            return mongoConverter(result);
        }
    }
}
async function get(id) {
    return ArtistModel.findOne({_id: id}).then(function (result) {
        if (result) {
            return mongoConverter(result);
        }
    });
}
async function createNewOrUpdate(data) {
    return Promise.resolve().then(() => {
        if (!data.id) {
            return new ArtistModel(data).save().then(result => {
                if (result[0]) {
                    return mongoConverter(result[0]);
                }
            });
        } else {
            return ArtistModel.findByIdAndUpdate(data.id, _.omit(data, 'id'), {new: true});
        }
    });
}
export default {
    query: query,
    get: get,
    createNewOrUpdate: createNewOrUpdate,

    model: ArtistModel
};
