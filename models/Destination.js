const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const destinationSchema  =  new Schema({

    title:{
        type: String,
    },

    date:{
        type: Date,
        default: new Date()
    }
})    

module.exports = mongoose.model('destinations', destinationSchema)