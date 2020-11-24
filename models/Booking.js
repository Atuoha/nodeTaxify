const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const BookingSchema = new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    destination:{
        type: String
    },

    location:{
        type: String
    },

    booking_time:{
        type: String
    },

    booking_date:{
        type: String
    },

    plan:{
        type: String
    },

    price:{
        type: String
    },

    status:{
        type: String,
        default: 'Active'
    },

    date:{
        type: Date
    }
})    


module.exports = mongoose.model('bookings', BookingSchema)