var Property = require('../models/Property').Property;

exports.userPropertyList = function(req, res, next){
  Property.
    find().
    sort( '-user' ).
    exec(function (err, properties) {
      res.json(properties);
    });
};

exports.list = function(req, res, next){
  Property.find({'_id'  : req.params.id, 
                 'user': req.session.user._id }, 
    function (err, properties) {
      //If user is not logged in user or an admin, don't show this
      // if( user.id !== req.cookies.user_id ){
      //   return res.json(false); //OR utils.forbidden( res );??????
      // }
      res.json(properties);
    });
};

exports.view = function(req, res, next) {
  if(req.params.id==='properties') {
    exports.list(req, res, next);
  } else if(req.params.id==='new') {    
    return res.json(new Property());
  } else {
    Property.findById( req.params.id, function (err, property){
      //If user is not logged in user or an admin, don't show this
      if(!req.session.user || 
         property.user.toString() !== req.session.user._id ){ //here, we use user.toString() b/c user is an ObjectId object and user.id is showing in unicode for some reason, breaking the logic. To see use the debugger.
        return next(new Error("User not authenticated")); //OR utils.forbidden( res );??????
      }
      res.json(property);    
    });
  }
};

exports.save = function(req, res, next) {
  // if(user.id !== req.cookies.user_id) {
  //   return utils.forbidden(res);
  // }  
  // if(!req.body.name || !req.body.name.trim()) {
  //   return next(new Error("Cannot save a nameless rental"));
  // }

  Property.findById(req.body._id, function(err, property){

    if(property) {
      property.name = req.body.name;
  
      if(req.body.rates) {
        property.rates = req.body.rates;
      }
  
      property.save( function(err, property, count) {
        if (err) { 
          return next(err);
        };
        return res.json(property);
      });
    } else if(req.body.name) {//If there is no name, then don't bother saving yet
      
      //Property doesn't exist yet, so create a new one
      new Property({
        name: req.body.name,
        rates: req.body.rates,
        user: req.session.user._id//temporary user id until I complete the sessions
      }).save( function (err, property, count) {
        if (err) { 
          return next(err);
        };    
        return res.json(property);
      });
    } else {
      return next(new Error("Nothing to create or update"));
    }
  });
}

exports.delete = function(req, res, next) {
  Property.findById( req.params.id, function ( err, property ){
    // if( user.id !== req.cookies.user_id ){
    //   return res.json(false); //OR utils.forbidden( res );??????
    // }
 
    // property.remove( function ( err, property ){
    //   if( err ) return next( err );
    //  
    //   res.json(true);
    // });
    res.json(true);
  });
}
