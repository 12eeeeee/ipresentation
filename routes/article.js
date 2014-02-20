var Article = require('../model/article');

module.exports = function (app) {

    app.get('/createArticle', function(req, res) {
        res.render('createArticle', {user : req.user });


    });

    app.post('/createArticle', function(req, res) {

        var _Article = new Article({ 
            username : req.user.username,
            ptname : req.body.ptname,
            date    : req.body.date,
            place : req.body.place
         });
         
         _Article.save(function(err, _Article){

            console.log('등록 완료 : username' , req.user.username );
         
                      res.redirect('/Plist');
            });
          
        });

    app.get('/Plist', function(req, res){
        //, Article : req.Article
      //  console.log(req._Article.ptname);


        Article.find(function(err, Article, count){
            res.render('Plist',
            {
                    user : req.user,
                    Article : Article
            });
            if(err)
                   console.log(err);
             
            });

   
        });

      app.get('/Pmenu/:cPage', function(req, res, next){
        var cPage = req.param('cPage');
        
        res.cookie('cPage', cPage);

        res.render('pmenu',
              {
                   user : req.user,  Article : req.Article , cPage : cPage    
              });
       // res.send(cPage);

          console.log(cPage);

          Article.find({ ptname : cPage }, function(err, Articles, count){
              if(err)
                console.log(err); //현재 페이지 제대로 들어 왔는지 확인 

          });

          

    });

    app.post('/canvas', function(req, res){
        var cPage = req.cookies.cPage;
        var SLIST = req.body.SLIST;
        var JLIST = req.body.JLIST;
        console.log('canvas is made');
        console.log('cPage : '+cPage);
        console.log('JLIST : '+req.body.JLIST);
        console.log('SLIST : '+req.body.SLIST);


/*    Article.remove({ptname:cPage}, function(err){
        if(err) return handleError(eror);
        console.log('remove!');
    })*/
    Article.update({ptname:cPage}, {$push:{'slide' : SLIST}} , {upsert:true,multi:false} , function(err,data){
        if(err)
            console.log(err);
    });

      
    Article.find({ ptname : cPage }, function(err, Article, count){
         //   Article.remove(Article.slide);
            console.log('Target Status'+Article.slide);

        });
       res.redirect('/Pmenu/'+cPage);


    });

    app.get('/canvas', function(req, res){
        var cPage = req.cookies.cPage;
        res.render('canvas', {user : req.user , Article : req.Article, cPage : cPage});

    });
   //res.render('Plist', {user : req.user, Article : Article});
}


