var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var Article = new Schema({
    ptname	: { type: String, default: '' },
    date	: { type: String, default: '' },
    explain : { type: String, default: '' },
    place	: { type: String, default: '' },
    username : {type : String, default: 'undefined'},
    slide : [],
    recordReal : {type : String, default:''},
    recordPractice : {"_id" :  { type: String }, "record" : {type:String}},
    writer : [{type:String, default:''}],
    message : [{type:String, default:''}]
});

var Slide = new Schema({
	slides : [Slide]

});
module.exports = mongoose.model('Article', Article);