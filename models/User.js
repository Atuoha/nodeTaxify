const mongoose =  require('mongoose'),
    Schema = mongoose.Schema;

const UserSchema = new Schema({

    fullname:{
        type: String,
        required: true
    },


    email:{
        type: String,
        required: true
    },


    file:{
        type: String,
        required: true
    },


    password:{
        type: String,
        required: true
    },


    status:{
        type: String,
    },


    role:{
        type: String,
    },

    
})    


module.exports = mongoose.model('users', UserSchema)