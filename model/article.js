var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var Article = new Schema({
    ptname	: { type: String, default: '' },
    date	: { type: String, default: '' },
    place	: { type: String, default: '' },
    username : {type : String, default: 'undefined'},
    slide : [],
<<<<<<< HEAD
    recordReal : {type : String, default:''},
    recordPractice : {"_id" :  { type: String }, "record" : {type:String}},
    board : {
        writer : { type: String, default: '' },
        message : { type: String, default: '' }
    }
=======
    recordReal : {type : String},
    recordPractice : []
>>>>>>> 5fcbf51e574fba3dfb1061f8cba9715d1796faa1
});

var Slide = new Schema({
	slides : [Slide]

});
module.exports = mongoose.model('Article', Article);