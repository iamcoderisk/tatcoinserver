const mongoose = require('mongoose');
var usersSchema =  new mongoose.Schema({
    email:{
      type:String
    }
});


module.exports= mongoose.model('Users',usersSchema)
