var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: { type: String, default: '' },
    password: { type: String, default: '' },
    birthday: { type: String, default: '' },
    email:   { type: String, default: '' },
    phonenum: { type: String, default: '' },
    sex: 	  { type: String, default: '' }
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);