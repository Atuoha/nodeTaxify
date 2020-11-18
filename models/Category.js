const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const CategorySchema  =  new Schema({

    title:{
        type: String,
    }

    date:{
        type: Date,
        default: new Date()
    }
})    