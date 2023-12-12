const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {type: String, required: [true, 'title is required']},
    host: {type: Schema.Types.ObjectId, ref: 'User'},
    details: {type: String, required: [true, 'details is required'], minLength: [10, 'the details should have at least 10 characters']},
    category: {type: String, enum: ['Gaming', 'Technology', 'Sports', 'Other'],  required: [true, 'Category is required'] },
    location: {type: String, required: [true, 'location is required']},
    startDateTime: { type: Date, required: [true, 'Start date and time are required'] },
    endDateTime: {type: Date, required: [true, 'End date and time are required'] },
    eventImage: {type: String }
},
{timestamps: true}
);
//collection name is events in the database
module.exports = mongoose.model('Event', eventSchema);


