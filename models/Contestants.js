var mongoose = require("mongoose");

let contestantSchema = new mongoose.Schema({
    fullname:String,
    nickname:String,
    bio:String,
    profileImage:String,
    votes:Number
});
module.exports = mongoose.model('Contestants',contestantSchema);
