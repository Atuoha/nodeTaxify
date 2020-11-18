const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newContact =  new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    subject:{
        type: String
    },

    message:{
        type: String
    }
})

module.exports = mongoose.model('contacts', newContact)