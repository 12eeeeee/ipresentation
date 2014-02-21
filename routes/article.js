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
       
       // console.log(Article);
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

          Article.findOne({ ptname : cPage }, function(err, doc, count){
            console.log('slide : ' +doc.slide);
              if(err)
                console.log(err); //현재 페이지 제대로 들어 왔는지 확인 

          });

          

    });

    app.post('/canvas', function(req, res){
        var cPage = req.cookies.cPage;
        var TEMP;
        var SLIST = req.body.SLIST;
        var JLIST = req.body.JLIST;
        console.log('canvas is made');
        console.log('cPage : '+cPage);
        console.log('JLIST : '+req.body.JLIST);
        console.log('SLIST : '+req.body.SLIST);
        console.log('SLIST TYPE ::'+ typeof SLIST);
     //   SLIST = Object.toJSON(SLIST);
/*    Article.remove({ptname:cPage}, function(err){
        if(err) return handleError(eror);
        console.log('remove!');
    })*/
//    SLIST = JSON.stringify(SLIST);
    //  console.log(SLIST);

          Article.update({ptname:cPage}, {'slide' : SLIST} , {upsert:true,multi:false} , function(err,data){
              if(err)
                  console.log(err);
                else{
                  //console.log(SLIST); 
                  console.log('--------------지금까지 SLIST였음'); 
                  console.log(typeof SLIST);
              }
          });

            
          Article.findOne({ ptname : cPage }, function(err, doc, count){
               //   Article.remove(Article.slide);
                  console.log('Target Status : '+ doc.slide);
                  if(err)
                    console.log(err);
                  TEMP = doc.slide;
                  console.log('TEMP :: ' + TEMP);
              });

              //res.cookie('SLIDE', TEMP);
              res.redirect('/Pmenu/'+cPage);


    });

    app.get('/canvas', function(req, res){
        var cPage = req.cookies.cPage;
        res.render('canvas', {user : req.user , Article : req.Article, cPage : cPage});

    });
   //res.render('Plist', {user : req.user, Article : Article});



    app.get('/presentPPT', function(req, res){
         console.log('presentPPT=>get');
         var cPage = req.cookies.cPage;
         var presentPPT_TEMP;

         Article.findOne({ ptname : cPage }, function(err, doc, count){
         //   Article.remove(Article.slide);
            console.log('Target Status : '+ doc.slide);
            if(err)
              console.log(err);
            presentPPT_TEMP = doc.slide;

            console.log('presentPPT_TEMP :: ' + presentPPT_TEMP);
            console.log('presentPPT_TEMP type' + typeof presentPPT_TEMP);
        

        res.render('presentPPT', {
            user : req.user,
            Article : req.Article,
            cPage : cPage,
            SLIDE : presentPPT_TEMP
        });
        });

    });

   //res.render('Plist', {user : req.user, Article : Article});
}


