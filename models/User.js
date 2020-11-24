const mongoose =  require('mongoose'),
    Schema = mongoose.Schema;

const UserSchema = new Schema({

    fullname:{
        type: String,
    },


    email:{
        type: String,
        required: true
    },


    phone:{
        type: String,
    },


    file:{
        type: String,
    },


    password:{
        type: String,
        required: true
    },


    status:{
        type: String,
        default: 'active'
    },


    role:{
        type: String,
        default: 'subscriber'
    },

    
})    


module.exports = mongoose.model('users', UserSchema)