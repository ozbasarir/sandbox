var Property = require('../models/Property').Property;
//var Owner = require('../models/Owner').Owner;

exports.ownerPropertyList = function(req, res, next){
  Property.
    find().
    sort( '-owner' ).
    exec(function (err, properties) {
      res.json(properties);
    });
};

exports.list = function(req, res, next){
  Property.find({'_id'  : req.params.id, 
                 'owner': req.session.user._id }, 
      function (err, properties) {
      //If owner is not logged in user or an admin, don't show this
      // if( owner.id !== req.cookies.user_id ){
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
      //If owner is not logged in user or an admin, don't show this
      if(!req.session.user || 
         property.owner.toString() !== req.session.user._id ){ //here, we use owner.toString() b/c owner is an ObjectId object and owner.id is showing in unicode for some reason, breaking the logic. To see use the debugger.
        return next(new Error("User not authenticated")); //OR utils.forbidden( res );??????
      }
      res.json(property);    
    });
  }
};

exports.save = function(req, res, next) {
  // if(owner.id !== req.cookies.user_id) {
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
        owner: req.session.user._id//temporary owner id until I complete the sessions
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
    // if( owner.id !== req.cookies.user_id ){
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
