const mongoose = require('mongoose');

var adminSchema =  new mongoose.Schema({
    firstname:{
      type:String
    },
    lastname:{
      type:String
    },
    email: {
      type:String
    },
    password:{
      type:String
    },
    isDeleted:{
      type:Boolean,
      default:false
    }
});


module.exports= mongoose.model('Admins',adminSchema)
