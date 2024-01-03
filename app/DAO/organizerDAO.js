// import mongoose from 'mongoose';
// import * as _ from 'lodash';
// import Promise from 'bluebird';
// import applicationException from '../service/applicationException';
// import mongoConverter from '../service/mongoConverter';
// import uniqueValidator from 'mongoose-unique-validator';
//
// import EventModel from './eventDAO'
// import {userRoles, userRole} from './userDAO'
//
// const organizerSchema = new mongoose.Schema({
//     email: { type: String, required: true, unique: true },
//     name: { type: String, required: true, unique: true },
//     role: { type: String, enum: userRoles, default: userRole.organizer, required: false },
//     active: { type: Boolean, default: true, required: false },
//     isAdmin: { type: Boolean, default: true, required: false },
//     ownedEvents: {event: { type: mongoose.Schema.Types.ObjectId, ref: 'events', required: false }},
// }, {
//     collection: 'organizer'
// });
//
// organizerSchema.plugin(uniqueValidator);
//
// const OrganizerModel = mongoose.model('organizer', organizerSchema);
//
// function createNewOrUpdate(organizer) {
//     return Promise.resolve().then(() => {
//         if (!organizer.id) {
//             return new  OrganizerModel(organizer).save().then(result => {
//                 if (result) {
//                     return mongoConverter(result);
//                 }
//             });
//         } else {
//             return OrganizerModel.findByIdAndUpdate(organizer.id, _.omit(organizer, 'id'), { new: true });
//         }
//     }).catch(error => {
//         if ('ValidationError' === error.name) {
//             error = error.errors[Object.keys(error.errors)[0]];
//             throw applicationException.new(applicationException.BAD_REQUEST, error.message);
//         }
//         throw error;
//     });
// }
//
// async function getByEmailOrName(name) {
//     const result = await OrganizerModel.findOne({ $or: [{ email: name }, { name: name }] });
//     if (result) {
//         return mongoConverter(result);
//     }
//     throw applicationException.new(applicationException.NOT_FOUND, 'Organizer not found');
// }
//
// async function get(id) {
//     const result = await OrganizerModel.findOne({ _id: id });
//     if (result) {
//         return mongoConverter(result);
//     }
//     throw applicationException.new(applicationException.NOT_FOUND, 'User not found');
// }
//
// async function removeById(id) {
//     return await OrganizerModel.findByIdAndRemove(id);
// }
//
// export default {
//     createNewOrUpdate: createNewOrUpdate,
//     getByEmailOrName: getByEmailOrName,
//     get: get,
//     removeById: removeById,
//
//     userRole: userRole,
//     model: OrganizerModel
// };
