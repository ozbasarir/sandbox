/* JSON api routes of owner consumed by the ANGULARJS client */

var Owner = require('../models/Owner').Owner;
//var pass = require('pwd');

exports.list = function(req, res, next){
  Owner.
    find().
    sort( '-created_on' ).
    exec(function (err, owners) {
      res.json({
        owners: owners
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

    Owner.findById( req.params.id, function (err, owner){
      //If owner is not logged in user or an admin, don't show this
      // if( owner.id !== req.cookies.user_id ){
      //   return res.json(false); //OR utils.forbidden( res );??????
      // }
      return res.json(owner);    
    });
  }
};

exports.add = function(req, res, next) {
  var name = req.body.name;
  var first = '', last = '';
  
  nameParts = name.split();
  if(nameParts.length > 1) {
    last = nameParts[nameParts.length-1];
    first = nameParts.slice(0, -1).toSource();
  } else {
    first = name;
  }

  var salt = 'abc';
  var pass = 'def';
  pass.hash(req.body.password, function(err, salty, hash){
    salt = salty;
    pass = hash;
//console.error('salty: '+salty+', hash'+hash);
  });
  
//console.error('first: '+first+', last: '+last+', salt: '+salt+', pass'+pass);
  new Owner({
    name: {
      first: first,
      last: last
    },
    email: req.body.email,
    password: pass,
    salt: salt,
  }).save( function (err, owner, count) {
    if (err) { 
      return next(err) 
    };    
    return res.json(owner.id);
  });

  res.json(true);
  //res.redirect('/');
}

exports.edit = function(req, res, next) {
  Owner.findById(req.params.id, function(err, owner){
    // if(owner.id !== req.cookies.user_id) {
    //   return utils.forbidden(res);
    // }
    owner.name = req.body.name;
    owner.email = req.body.email;
    owner.password = req.body.password;

    owner.save( function(err, owner, count) {
      if (err) { return next(err) };
    });
  });
  
  res.json(true);
}

exports.delete = function(req, res, next) {
  Owner.findById( req.params.id, function ( err, owner ){
    // if( owner.id !== req.cookies.user_id ){
    //   return res.json(false); //OR utils.forbidden( res );??????
    // }
 
    // owner.remove( function ( err, owner ){
    //   if( err ) return next( err );
    //  
    //   res.json(true);
    // });
    res.json(true);
  });
}

