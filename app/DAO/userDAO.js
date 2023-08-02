
import mongoose from 'mongoose';
import * as _ from 'lodash';
import Promise from 'bluebird';
import applicationException from '../service/applicationException';
import mongoConverter from '../service/mongoConverter';
import uniqueValidator from 'mongoose-unique-validator';

import EventModel from './eventDAO'

const userRole = {
    admin: 'admin',
    user: 'user'
};

const userRoles = [userRole.admin, userRole.user];

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    role: { type: String, enum: userRoles, default: userRole.admin, required: false },
    active: { type: Boolean, default: true, required: false },
    isAdmin: { type: Boolean, default: false, required: false },
    cart: [
        {
            event: { type: mongoose.Schema.Types.ObjectId, ref: 'events', required: true },
            tickets: [
                {
                    ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'tickets', required: true },
                    quantity: { type: Number, default: 1, required: true },
                }
            ]
        }
    ],
    likedEvents: {type: [mongoose.Schema.Types.ObjectId]},
    followedEvents: {type: [mongoose.Schema.Types.ObjectId]}
}, {
    collection: 'user'
});

userSchema.plugin(uniqueValidator);

const UserModel = mongoose.model('user', userSchema);

function createNewOrUpdate(user) {
    return Promise.resolve().then(() => {
        if (!user.id) {
            return new  UserModel(user).save().then(result => {
                if (result) {
                    return mongoConverter(result);
                }
            });
        } else {
            return UserModel.findByIdAndUpdate(user.id, _.omit(user, 'id'), { new: true });
        }
    }).catch(error => {
        if ('ValidationError' === error.name) {
            error = error.errors[Object.keys(error.errors)[0]];
            throw applicationException.new(applicationException.BAD_REQUEST, error.message);
        }
        throw error;
    });
}

async function getByEmailOrName(name) {
    const result = await UserModel.findOne({ $or: [{ email: name }, { name: name }] });
    if (result) {
        return mongoConverter(result);
    }
    throw applicationException.new(applicationException.NOT_FOUND, 'User not found');
}

async function get(id) {
    const result = await UserModel.findOne({ _id: id });
    if (result) {
        return mongoConverter(result);
    }
    throw applicationException.new(applicationException.NOT_FOUND, 'User not found');
}

async function removeById(id) {
    return await UserModel.findByIdAndRemove(id);
}

//Cart
async function addToCart(userId, eventId, ticketId, quantity) {
    try {
        const user = await UserModel.findOne({ _id: userId });
        if (!user) {
            throw applicationException.new(applicationException.NOT_FOUND, 'User not found');
        }

        // Find the cart item that matches the provided eventId
        const cartItem = user.cart.find(item => item.event.toString() === eventId);

        if (!cartItem) {
            // If no cart item exists for the event, create a new one with the provided ticket and quantity
            user.cart.push({
                event: eventId,
                tickets: [{ ticket: ticketId, quantity }]
            });
        } else {
            // If the cart item exists, find the ticket that matches the provided ticketId
            const ticket = cartItem.tickets.find(t => t.ticket.toString() === ticketId);

            if (ticket) {
                // If the ticket exists, update its quantity
                ticket.quantity += quantity || 1;
            } else {
                // If the ticket does not exist, add a new ticket to the cart item
                cartItem.tickets.push({ ticket: ticketId, quantity });
            }
        }

        // Save the updated user with the modified cart
        const updatedUser = await user.save();
        return mongoConverter(updatedUser);
    } catch (error) {
        throw error;
    }
}

async function removeFromCart(userId, eventId, ticketId, quantity) {
    try {
        const user = await UserModel.findOne({ _id: userId });
        if (!user) {
            throw applicationException.new(applicationException.NOT_FOUND, 'User not found');
        }

        const existingCart = user.cart.find(item => item.event.toString() === eventId);
        if (!existingCart) {
            throw applicationException.new(applicationException.NOT_FOUND, 'Event not found in the cart');
        }

        const existingTicket = existingCart.tickets.find(ticket => ticket.ticket.toString() === ticketId);
        if (!existingTicket) {
            throw applicationException.new(applicationException.NOT_FOUND, 'Ticket not found in the cart');
        }

        if (quantity && quantity >= existingTicket.quantity) {
            // If the requested quantity is greater than or equal to the current quantity, remove the entire ticket
            existingCart.tickets = existingCart.tickets.filter(ticket => ticket.ticket.toString() !== ticketId);
        } else {
            // Otherwise, decrement the ticket quantity by the requested amount
            existingTicket.quantity -= quantity || 1;
        }

        // If there are no more tickets for the event, remove the entire event from the cart
        if (existingCart.tickets.length === 0) {
            user.cart = user.cart.filter(item => item.event.toString() !== eventId);
        }

        // Save the updated user with the modified cart
        await user.save();
        return mongoConverter(user);
    } catch (error) {
        throw error;
    }
}
async function getCart(userId) {
    try {
        const user = await UserModel.findOne({ _id: userId }).populate('cart.event cart.tickets.ticket');
        if (!user) {
            throw applicationException.new(applicationException.NOT_FOUND, 'User not found');
        }

        // Populate the cart items with event and ticket details, including quantity
        const populatedCart = user.cart.map(item => {
            const populatedEvent = item.event;
            const populatedTickets = item.tickets.map(ticketWithQuantity => {
                const ticket = ticketWithQuantity.ticket.toObject();
                ticket.quantity = ticketWithQuantity.quantity;
                return ticket;
            });
            return {
                event: populatedEvent,
                tickets: populatedTickets,
            };
        });

        return populatedCart;
    } catch (error) {
        throw error;
    }
}


//Likes and follows
// TODO: do poprawy kod, rozwiązanie tymczasowe
async function likeOrFollowEvent(userId, eventId, actionType) {
    try {
        console.log("userId server:"+userId);
        const user = await UserModel.findOne({ _id: userId });
        console.log("user server:"+user);
        const checkLikes = await UserModel.findOne({ _id: userId, [actionType]: eventId});
        if (user) {
            if(!checkLikes)
            {
                //If event is not liked, like it
                return UserModel.updateOne({ _id : userId }, {$push: {[actionType]: eventId}}, {new: true})
            }
            else
            {
                //If event is liked, dislike it
                return UserModel.updateOne({ _id : userId }, {$pull: {[actionType]: eventId}})
            }
        } else {
            throw applicationException.new(applicationException.NOT_FOUND, 'User not found');
        }

    } catch (error) {
        throw error;
    }
}

async function getLikedOrFollowedEvents(userId, actionType) {
    let user;
    //Find user
    await UserModel.findOne({ _id: userId}).then(function (result) {
        if (result) {
            user = result.toObject();
            // console.log("user likedrecipes: "+user.likedEvents);
        }
    });
    if(!user){
        console.log("!user");
        return EventModel.model;
    }
    //Find recipe of given likedRecipes id
    if(actionType && actionType==='like'){
        return EventModel.model.find({_id:user.likedEvents}).then(function (result) {
        if (result) {
            console.log("result: "+result);
            return mongoConverter(result);
        }
    });
    } else if(actionType && actionType==='follow')
    {
        return EventModel.model.find({_id:user.followedEvents}).then(function (result) {
            if (result) {
                console.log("result: "+result);
                return mongoConverter(result);
            }
        });
    }
    else{
        throw applicationException.new(applicationException.NOT_FOUND, 'Action type is not valid.');
    }
}

// Function to count the number of object IDs in the `followedEvents` array
async function countFollowedEvents(userId) {
    const user = await UserModel.findOne({ _id: userId });
    if (user) {
        return user.followedEvents.length;
    }
    return 0;
}

// Function to count the number of object IDs in the `likedEvents` array
async function countLikedEvents(userId) {
    const user = await UserModel.findOne({ _id: userId });
    if (user) {
        return user.likedEvents.length;
    }
    return 0;
}

export default {
    createNewOrUpdate: createNewOrUpdate,
    getByEmailOrName: getByEmailOrName,
    get: get,
    removeById: removeById,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    getCart: getCart,
    likeOrFollowEvent: likeOrFollowEvent,
    getLikedOrFollowedEvents: getLikedOrFollowedEvents,
    countFollowedEvents: countFollowedEvents,
    countLikedEvents: countLikedEvents,

    userRole: userRole,
    model: UserModel
};
