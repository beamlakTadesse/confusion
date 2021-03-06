var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');


var User = require('../model/user');
var authenticate = require('../authenticate');
var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/signup', function (req, res, next) {
  User.register(new User({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('content-Type', 'applicatio/json');
        res.json({ err: err });
      }
      else {
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('content-Type', 'applicatio/json');
          res.json({ success: true,status: 'registration successful!',user: user })
        })
      }
    });
});


router.post('/login', passport.authenticate('local'),(req,res)=>{
  var token = authenticate.getToken({_id:req.user._id});
  res.statusCode = 200;
  res.setHeader('content-Type', 'applicatio/json');
  res.json({ success: true,token: token, status: 'login successful', user: User });
});
router.get('/logout', function (req, res) {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not loged in.');
    err.status = 403;
    return next(err);
  }

})

module.exports = router;
