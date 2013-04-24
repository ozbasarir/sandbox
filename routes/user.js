/* JSON api routes of user consumed by the ANGULARJS client */

var User = require('../models/User').User;
//  , bcrypt = require('bcrypt'); 
//var pass = require('pwd');

exports.list = function(req, res, next){
  User.
    find().
    sort( '-created_on' ).
    exec(function (err, users) {
      res.json({
        users: users
      });
    });
};

exports.view = function(req, res, next) {
  if('myself' == req.params.id) {

    if(req.session.user) {
      return res.json(req.session.user);
    }
    
    return next(new Error("User not authenticated"));
    
  } else {

    User.findById( req.params.id, function (err, user){
      //If user is not logged in user or an admin, don't show this
      // if( user.id !== req.cookies.user_id ){
      //   return res.json(false); //OR utils.forbidden( res );??????
      // }
      return res.json(user);    
    });
  }
};

exports.save = function(userData, fn) {
  var name = userData.profile.name.formatted;
  var first = '', last = '';
  
  nameParts = name.split(' ');
console.log('bere'+nameParts.length);
  if(nameParts.length > 1) {
console.log('here'+nameParts.length);
    last = nameParts[nameParts.length-1];
    first = nameParts.slice(0, -1).join(' ');
  } else {
    first = name;
  }

  if(userData.profile.verifiedEmail) {
    var email = userData.profile.verifiedEmail;
  } else if(userData.profile.email) {
    var email = userData.profile.email;
  } else {
    return fn("No email. Cannot create user.", null);
  }
  
  new User({
    name: {
      first: first,
      last: last
    },
    email: email,
    third_party_id: userData.profile.identifier,
  }).save( function (err, user, count) {
    if (err) { 
      console.error(err);
      fn(err, null);
    }

    fn(null, user);
  });  
}

exports.edit = function(req, res, next) {
  User.findById(req.params.id, function(err, user){
    // if(user.id !== req.cookies.user_id) {
    //   return utils.forbidden(res);
    // }
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save( function(err, user, count) {
      if (err) { return next(err) };
    });
  });
  
  res.json(true);
}

exports.delete = function(req, res, next) {
  User.findById( req.params.id, function ( err, user ){
    // if( user.id !== req.cookies.user_id ){
    //   return res.json(false); //OR utils.forbidden( res );??????
    // }
 
    // user.remove( function ( err, user ){
    //   if( err ) return next( err );
    //  
    //   res.json(true);
    // });
    res.json(true);
  });
}

