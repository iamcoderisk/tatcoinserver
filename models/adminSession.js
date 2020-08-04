const mongoose = require('mongoose');

const adminSessionSchema =  new mongoose.Schema({
  userId:{
    type:String
  },
  timestamp:{
    type: Date,
    default:Date.now()
  },
  isDeleted:{
    type:Boolean,
    default:false
  }
});
module.exports  = mongoose.model('AdminSession',adminSessionSchema);
