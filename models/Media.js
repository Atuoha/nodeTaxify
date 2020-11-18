const mongoose  = require('mongoose')
const Schema  = mongoose.Schema

const newMedia = new Schema({
   
    file:{
        type: String
    }
})

module.exports = mongoose.model('medias', newMedia)