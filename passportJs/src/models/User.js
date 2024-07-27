const mongoose = require("mongoose")


const User = mongoose.model("User",{
    email:{
        type: String,
        required:true,
        unique: true
    },
    password:{
        type: String,
        required:true
    },
    creationDate:{
        type:String,
        default: new Date()
    }
})

module.exports = User;