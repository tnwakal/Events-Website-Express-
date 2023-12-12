const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvp = new Schema({
    status: { type: String, enum: ['YES', 'NO', 'MAYBE'], required: [true, 'status is required']},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: [true, 'user is required']},
    event: {type: Schema.Types.ObjectId, ref: 'Event', required: [true, 'event is required']},
},
{timestamps: true}
);
//collection name is rsvp in the database
module.exports = mongoose.model('RSVP', rsvp);


