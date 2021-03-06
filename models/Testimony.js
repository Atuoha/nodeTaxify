const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const testimonySchema = new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    content:{
        type: String
    }
})    

module.exports = mongoose.model('testimonies', testimonySchema)