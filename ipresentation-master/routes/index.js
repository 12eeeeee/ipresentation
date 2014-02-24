
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express'});
};

exports.loggedin = function(req, res){
  res.render('loggedin', {title: 'Express', user: req.user});

};

exports.register = function(req, res){
	console.log('register');
  res.render('register', {title: 'Express', user: req.user});
};

exports.ctrReveal = function(req, res){
  res.render('control-reveal', {title: 'Express', user: req.user});

};
exports.reveal = function(req, res){
  res.render('reveal', {title: 'Express', user: req.user});

};

exports.upload = function(req, res){
  res.render('upload', {title: 'Express', user: req.user});
};

exports.createArticle = function(req, res){

  res.render('createArticle', {title: 'Express', user: req.user});
};

/*exports.reveal = function(req, res){
  res.render('decks/reveal.js/index', {title: 'Express', user: req.user});

};
*/