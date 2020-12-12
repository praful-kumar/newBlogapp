var express = require('express');
var router = express.Router();
var autherModel = require('./users');
var passport = require('passport');
var passportLocal = require('passport-local');
var bookModel = require('./books')



passport.use(new passportLocal(autherModel.authenticate()));
/* GET home page. */
router.get('/',redirectToProfile, function(req, res){
  res.render('index');
});
/*resgistion code*/

router.post('/reg', function(req, res){
  var newauther= new autherModel({
    name: req.body.name,
    email:req.body.email,
    username : req.body.username
  });
  autherModel.register(newauther, req.body.password)
  .then(function(registerUser){
    passport.authenticate('local')(req ,res,function(){
      res.redirect('/profile');
    });
  })
});

/*login code*/
router.get('/create', function(req, res){
  res.render('create')
});


router.post('/login', passport.authenticate('local',{
  successRedirect: '/profile',
  failureRedirect: '/'
}), function(userLogin){});

router.get('/profile',isLoggedIn, function(req, res){
  res.render('profile')
});
router.get('/logout', function(req, res){
  req.logOut();
  res.redirect('/');
})
router.post('/regbook',function(req, res){
    autherModel.findOne({username:req.session.passport.user})
    .then(function(loggedinUser){
      bookModel.create({
        author: loggedinUser._id,
        bookname:req.body.bookname,
        bookprice:req.body.bookprice
      })
      .then(function(bookcreated){
        loggedinUser.book.push(bookcreated);
        loggedinUser.save()
        .then(function(usersaved){
          res.redirect('/profile')
        })
      });

    });
});


router.get('/allbooks', isLoggedIn, function(req, res){
    bookModel.find()
    .populate('author')
    .exec(function(err, allbooks){
      res.render('allbooks', {allbooks:allbooks})
    })
});

/*---------------my book----------*/
router.get('/mybooks', isLoggedIn, function(req, res){
  autherModel.findOne({username:req.session.passport.user})
    .populate('book')
    .exec(function(err, allbooks){
      res.render('books', {allbooks:allbooks,})
    });
});


/*--------Delete-Mybooks---------- */

router.get('/delete/:_id',isLoggedIn,(req, res)=>{
    bookModel.findByIdAndDelete({_id:req.params._id})
    .populate('author','username')
    .exec((err,Delbook)=>{
      res.redirect('/profile');

    })
})
/*----updateBooks----*/
router.post('/update/:_id',isLoggedIn,(req, res)=>{
  bookModel.findOneAndUpdate({_id:req.params._id}, {bookname:req.body.name})
  .then((upadted)=>{
    res.redirect('/allbooks')
  })
})

/*----updateprice-----*/





/*loging function*/
function isLoggedIn(req, res, next)
{
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/');
  }
}
/* redirectto profile if login */
function redirectToProfile(req, res, next){
  if(req.isAuthenticated()){
    res.redirect('/profile');
  }
  else{
    return next();
  }
}



module.exports = router;
