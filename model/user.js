const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
const schema = mongoose.Schema;

var user = new schema({
    
    admin: {
        default: false,
        type: Boolean
    }
});
user.plugin(passportLocalMongoose);
module.exports = mongoose.model('user',user);