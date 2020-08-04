var mongoose = require("mongoose");

let voteSchema = new mongoose.Schema({
   contestant:String,
   voter_id:String
});


module.exports = mongoose.model('Votes',voteSchema);
