var passport = require('passport'),
    Account = require('../model/account');
    Article = require('../model/article'),
    fs = require('fs');

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
        var name = req.body.R_NAME;
        var blob = req.body.R_blob;
        name = name+'_'+req.cookies.cPage+'.wav';
        console.log(name);
       // console.log(blob);


        base64Data = blob.replace(/^data:audio\/wav;base64,/,""),
        binaryData = new Buffer(base64Data, 'base64').toString('binary');
        
        var filePath = __dirname + "\\files\\"+ name;

        fs.writeFile(filePath, binaryData, "binary", function(error){
                if(error){
                    throw error;
                }else{
                    console.log('FILE is made');
                    res.redirect('/presentPPT');
                }
            });
               // 아티클에 파일이름 넣어보자
        console.log(filePath);
        Article.update({'ptname':  req.cookies.cPage}, {'$push':{'recordReal':filePath}});
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


  
    app.get('/practicePPT', function(req, res){
     console.log('practicePPT=>get');
        res.render('practicePPT', {
            user : req.user,
            Article : req.Article,
            cPage : req.cookies.cPage
        });
    });
      
};