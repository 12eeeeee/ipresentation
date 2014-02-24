
/**
 * Module dependencies.
 */

 var express = require('express')
 , routes = require('./routes')
 , user = require('./routes/user')
 , article = require('./model/article')
 , http = require('http')
    , cons = require('consolidate') // Templating library adapter for Express
    , swig = require('swig')
    , path = require('path')
    , mongoose = require('mongoose')
    , passport = require('passport') //로그인 모듈 
    , LocalStrategy = require('passport-local').Strategy
    , ejs = require('ejs'); // HTML <% %>

    var app = express();

app.use(express.bodyParser());  //페이지간 이동 시 정보 전달 (위치가 중요 !)
/////////////////////////////////////////////////로그인
var Account = require('./model/account');
passport.use(new LocalStrategy(Account.authenticate()));
app.use(express.cookieParser());
app.use(express.cookieSession({secret: 'asdfasdfasdf'}));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

mongoose.createConnection('mongodb://insightpresentation:tkfkdgks0@ds027709.mongolab.com:27709/ipt');
require('./routes/login.js')(app);
require('./routes/article.js')(app);

app.use(express.methodOverride());
var User = require('./model/user');

var config = require('./config');

/*var passport = require('passport'),
    FacbookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function(user, done){
    done(null, user.id)
});
passport.deserializeUser(function(id,done){
    User.findOne(id, function(err, user){
        done(err, user);
    })
});
*/
/*// setting for passport
passport.use(new FacbookStrategy({
        clientID: config.development.fb.appId,
        clientSecret: config.development.fb.appSecret,
        callbackURL: config.development.fb.url + 'fbauthed'
    },
    function(accessToken, refreshToken, profile, done){
        process.nextTick(function(){
            var query = User.findOne({'fbId' : profile.id});
            query.exec(function(err, oldUser){
                if (oldUser) {
                    console.log('Existing User: ' + oldUser.name + 'found and logged in!');
                    done(null, oldUser);
                } else {
                    var newUser = new User();
                    newUser.fbId = profile.id;
                    newUser.name = profile.displayName;
                    newUser.email = profile.emails[0].value;

                    newUser.save(function (err) {
                        if (err) throw err;
                        console.log('New user: ' + newUser.name + 'created and logged in!');
                        done(null, newUser);

                    })
                }
            });
        });
    })
);
+

*/



//뭔지몰라서 더합니다
app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// all environments
app.set('port', process.env.PORT || 3000);
app.use (express.static(__dirname + '/views'));
app.use (express.static(__dirname + '/views/js'));
app.engine('.html', ejs.__express);
//app.engine('html', cons.swig);
app.set('view engine', 'html');

app.set('views', __dirname + '/views');
app.get('/reveal', routes.reveal);
app.set('view options', { layout:false });
app.use(express.favicon());
app.use(express.logger('dev'));

app.use(express.cookieParser());
app.use(express.session({secret: 'asdfasdfasdf'}));



//app.use(passport.session());


app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
app.get('/', routes.index);
app.get('/ctrReveal', routes.ctrReveal);
app.post('/createArticle', routes.createArticle );
//app.get('/reveal', routes.reveal);

/*app.get('/fbauth', passport.authenticate('facebook', {scope: 'email'}));
app.get('/fbauted', passport.authenticate('facebook', {failureRedirect: '/'}), routes.loggedin);
app.get('/logout', function(req, res){
    req.logOut();
    res.redirect('/');
});*/







app.get('/users', user.list);
var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

/*app.get('/register', function(req, res) {
    res.render('register', { });
});

app.post('/register', function(req, res) {

    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }
     
        console.log('등록 완료 : username' , username );
        res.redirect('/');
    });
});*/


var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket){

    socket.on('message', function(message){
        socket.broadcast.emit('message', message);
    });

    socket.on('key down', function(data){
        socket.broadcast.emit('key down', data);
    });
    
    socket.on('key up', function(data){
        socket.broadcast.emit('key up', data);
    });

    socket.on('flowtime minimap complete', function(data){
        socket.broadcast.emit('flowtime minimap complete', data);
    });

    socket.on('navigate', function(data){
        socket.broadcast.emit('navigate', data);
    });

    socket.on('disconnect', function(){
        console.log("Connection " + socket.id + " terminated.");
    });


    socket.on('join',function(data){
        var id   =data.Userid;
        var pass =data.Password;
        console.log('회원가입요청');
        console.log(id);
        console.log(pass);
        CommentModel.findOne({"ID":id},function(error,data){
            if(data===null){
              console.log("해당 가입자 없음");
              var comment = new CommentModel();
              comment.ID = id;
              comment.PASSWORD = pass;
              comment.STARTNUM=0;
              comment.save(function (err) {
                if (!err) {
                  console.log('가입 성공!');
                  socket.emit('errormessage',{'error':'가입 성공했습니다. 로그인하세요.'});
              }
          });
          }
          else{
           console.log("이미 가입했음");
           socket.emit('errormessage',{'error':'이미 존재하는 아이디입니다.'});
       }
   });  
    });
});


