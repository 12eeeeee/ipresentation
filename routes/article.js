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
    app.get('/Llist', function(req, res){

        Article.find(function(err, Article, count){
            res.render('Llist',
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
          console.log(cPage);

          Article.findOne({ ptname : cPage }, function(err, doc, count){
          //  console.log('slide : ' +doc.slide);
              if(err)
                console.log(err); //현재 페이지 제대로 들어 왔는지 확인 

          });
    });

      app.get('/Lmenu/:cPage', function(req, res, next){
        var cPage = req.param('cPage');     
        res.cookie('cPage', cPage);
        res.render('Lmenu',
              {
                   user : req.user,  Article : req.Article , cPage : cPage    
              });
          console.log(cPage);

          Article.findOne({ ptname : cPage }, function(err, doc, count){
            console.log('slide : ' +doc.slide);
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
    Article.update({ptname:cPage}, {'slide' : SLIST} , {upsert:true,multi:false} , function(err,data){
        if(err)
            console.log(err);
    });

      
    Article.findOne({ ptname : cPage }, function(err, doc, count){
         //   Article.remove(Article.slide);
            console.log('Target Status : '+ doc.slide);
            if(err)
              console.log(err);
        });
       res.redirect('/Pmenu/'+cPage);


    });

    app.get('/canvas', function(req, res){
        var cPage = req.cookies.cPage;
        res.render('canvas', {user : req.user , Article : req.Article, cPage : cPage});

    });
   //res.render('Plist', {user : req.user, Article : Article});
}


