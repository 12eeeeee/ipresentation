var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var Article = new Schema({
    ptname	: { type: String, default: '' },
    date	: { type: String, default: '' },
    place	: { type: String, default: '' },
    username : {type : String, default: 'undefined'},
    slide : Schema.Types.Mixed
    });

module.exports = mongoose.model('Article', Article);