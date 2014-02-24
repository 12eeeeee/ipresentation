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
      place : req.body.place,
      explain : req.body.explain
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
    var L_TEMP;
    var L_DATE;
    var L_PLACE;

    res.cookie('cPage', cPage);

    console.log(cPage);
    console.log(Article);
    Article.findOne({ ptname : cPage }, function(err, doc, count){
      console.log('slide : ' +doc.slide);
      if(err)
        console.log(err); //현재 페이지 제대로 들어 왔는지 확인 
      L_TEMP = doc.explain;
      L_DATE = doc.date;
      L_PLACE = doc.place;

      res.render('Lmenu', {
          user : req.user,
          Article : req.Article,
          cPage : cPage,
          explain : L_TEMP,
          date: L_DATE,
          place : L_PLACE
        });
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

  app.get('/presentPPT', function(req, res){
   console.log('presentPPT=>get');
   var cPage = req.cookies.cPage;
   var presentPPT_TEMP;

   Article.findOne({ ptname : cPage }, function(err, doc, count){
         //   Article.remove(Article.slide);
        // console.log('Target Status : '+ doc.slide);
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
       //20140221 혜진
       app.get('/Listenpt', function(req, res) {
        /*res.render('Listenpt', {user : req.user, Article : req.Article});*/
        var cPage = req.cookies.cPage;
        console.log(cPage);
        Article.find({ 'ptname' : cPage }, function(err, Article, count){
          console.log(Article);
          res.render('Listenpt',
          {
            user : req.user,
            Article : Article,
            cPage : cPage
          });
          if(err)
            console.log(err);
        });

      });

      app.post('/Listenpt', function(req, res) {

      var cPage = req.cookies.cPage;
      console.log(Article);
      Article.update({'ptname': cPage }, {$push:{'writer':req.user.username,'message':req.body.comment}},{upsert:true},
       function(err,data){
              console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!');
              console.log(Article);
              if(err)
                  console.log(err);
                else{
                  console.log('등록 완료 : username' , req.user.username );
                  console.log(Article);
                  res.redirect('/Listenpt');
              }
          });             
      });



    app.get('/check_comment', function(req, res) {
      /*res.render('Listenpt', {user : req.user, Article : req.Article});*/
      var cPage = req.cookies.cPage;
      console.log(cPage);
      Article.find({ ptname : cPage }, function(err, Article, count){
        console.log(Article);
        res.render('check_comment',
        {
          user : req.user,
          Article : Article,
          cPage : cPage
        });
        if(err)
          console.log(err);
      });
    });

    app.post('/check_comment', function(req, res) {

      var cPage = req.cookies.cPage;
      Article.update({ ptname: cPage }, {$push:{'writer':req.user.username,'message':req.body.comment}},
       function(err,data){
              if(err)
                  console.log(err);
                else{
                  console.log('등록 완료 : username' , req.user.username );
                  console.log(Article);
                  res.redirect('/check_comment');
              }
          }); 
                    
      });
  

 app.get('/canvas', function(req, res){
  var cPage = req.cookies.cPage;
  res.render('canvas', {user : req.user , Article : req.Article, cPage : cPage});

});

   //res.render('Plist', {user : req.user, Article : Article});
 }


