var passport = require('passport'),
Account = require('../model/account');
Article = require('../model/article'),
fs = require('fs');
io = require('socket.io');


module.exports = function (app) {

  app.get('/', function (req, res) {
    res.render('index', { user : req.user});
    if(!req.user ){
      console.log('main User Info 1', req.user);
    }else{
      console.log('main User Info 2', req.user.username);
    }
  });

  app.get('/register', function(req, res) {
    res.render('register', { });
  });

  app.post('/register', function(req, res) {

    Account.register(new Account({ 
      username : req.body.username,
      birthday : req.body.birthday,
      email    : req.body.email,
      phonenum : req.body.phonenum,
      sex      : req.body.sex
    }), req.body.password, function(err, account) {
      if (err) {
        return res.render('register', { account : account });
      }

      console.log('등록 완료 : username' , req.body.username );
      res.redirect('/login');
    });
  });


  app.get('/login', function(req, res) {
    res.render('login', { user : req.user });
/* if(tyoeif(user) == 'undefined')
res.redirect('/login');
else
  res.redirect('/index');*/

});

  app.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });



  app.post('/upload', function(req, res){

    console.log('POST');
// var url = req.body.R_URL;
//views/js/recorder.js와 연결됨
var name = req.body.R_NAME;
var blob = req.body.R_blob;
name = name+'_'+req.cookies.cPage+'.wav';
console.log(name);
// console.log(blob);

base64Data = blob.replace(/^data:audio\/wav;base64,/,""),
binaryData = new Buffer(base64Data, 'base64').toString('binary');
var fileRoute =  "\\files\\"+ name;
var filePath = __dirname + fileRoute;

fs.writeFile(filePath, binaryData, "binary", function(error){
  if(error){
    throw error;
  }else{
    console.log('FILE is made');



    res.redirect('/presentPPT');
  }
});
// 아티클에 파일이름 넣어보자
console.log(fileRoute);
Article.update({'ptname':  req.cookies.cPage}, {'recordReal':filePath}, function(err, doc){
  if(err)
console.log(err); //현재 페이지 제대로 들어 왔는지 확인 
else
  console.log('파일 들어감');
});


Article.findOne({ ptname : req.cookies.cPage }, function(err, doc, count){
  console.log('slide : ' +doc.recordReal);
  if(err)
console.log(err); //현재 페이지 제대로 들어 왔는지 확인 
});

});
app.get('/upload', function(req, res){
  console.log('upload=>get');
  res.render('index', {
    user : req.user,
    Article : req.Article,
    cPage : req.cookies.cPage

  });
});

/*app.get('/presentPPT', function(req, res){
console.log('presentPPT=>get');
res.render('presentPPT', {
user : req.user,
Article : req.Article,
cPage : req.cookies.cPage
});
});*/

app.get('/practicePPT', function(req, res){
  console.log('practicePPT=>get');
  res.render('practicePPT', {
    user : req.user,
    Article : req.Article,
    cPage : req.cookies.cPage
  });
});

app.get('/L_replay_control', function(req, res){
  console.log('replay=>get');
  var cPage = req.cookies.cPage;
  console.log(cPage);

      Article.find({ ptname : cPage }, function(err, Article, count){
        console.log('Article board가 나가십니다.'+ Article.board);
        if(err)
          console.log(err);
      });
      

      Article.findOne({'ptname':cPage}, function(err, doc, count){ 
        console.log('article 입니다'+doc);
        console.log('article.recordreal 입니다'+doc.recordReal);
        process.chdir(__dirname);
        var returnData;
        var StringData;

        fs.readFile('C:\/IJ\/0222_ij\/routes\/files\/undefined_hello2.wav', function (err,data) {
          console.log('data입니다~'+data);
          StringData = JSON.stringify(data);
          console.log('String으로  바뀐 정보는 '+StringData);
          var base64File = new Buffer(data, 'base64').toString('binary');
          console.log(base64File);

          returnData = base64File;

          console.log('base64가 나와주길 바랍니다=>'+returnData);
          if (err) {
            return console.log(err);
          }

          res.data;
        });

 
       
        res.render('L_replay_control',
        {
          user : req.user,
          Article : doc,
          returnData : StringData
        });
        if(err)
          console.log(err);   
      });
})
};