var Rental = require('../models/Rental').Rental;

exports.userRentalList = function(req, res, next){
  Rental.
    find().
    sort( '-user' ).
    exec(function (err, rentals) {
      res.json(rentals);
    });
};

exports.list = function(req, res, next){
  Rental.find({ 'user': req.session.user._id }, 
    function (err, rentals) {
      res.json(rentals);
    });
};

exports.view = function(req, res, next) {
  if(req.params.id==='rentals') {
    exports.list(req, res, next);
  } else if(req.params.id==='new') {    
    return res.json(new Rental());
  } else {
    Rental.findById( req.params.id, function (err, rental){
      //If user is not logged in user or an admin, don't show this
      if(!req.session.user || 
         rental.user.toString() !== req.session.user._id ){ //here, we use user.toString() b/c user is an ObjectId object and user.id is showing in unicode for some reason, breaking the logic. To see use the debugger.
        return next(new Error("User not authenticated")); //OR utils.forbidden( res );??????
      }
      res.json(rental);    
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

  Rental.findById(req.body._id, function(err, rental){

    if(rental) {
      rental.name = req.body.name;
  
      if(req.body.rates) {
        rental.rates = req.body.rates;
      }
  
      if(req.body.contracts) {
        rental.contracts = req.body.contracts;
      }
  
      rental.save( function(err, rental, count) {
        if (err) { 
          return next(err);
        };
        return res.json(rental);
      });
    } else if(req.session.user._id) {
      
      //Rental doesn't exist yet, so create a new one
      new Rental({
        user: req.session.user._id
      }).save( function (err, rental, count) {
        if (err) { 
          return next(err);
        };    
        return res.json(rental);
      });
    } else {
      return next(new Error("Nothing to create or update"));
    }
  });
}

exports.delete = function(req, res, next) {
  Rental.findById( req.params.id, function ( err, rental ){
    // if( user.id !== req.cookies.user_id ){
    //   return res.json(false); //OR utils.forbidden( res );??????
    // }
 
    // rental.remove( function ( err, rental ){
    //   if( err ) return next( err );
    //  
    //   res.json(true);
    // });
    res.json(true);
  });
}
