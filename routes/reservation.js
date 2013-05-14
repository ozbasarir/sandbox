var Reservation = require('../models/Reservation').Reservation;

exports.list = function(req, res, next) {
  res.json(true);
}

exports.view = function(req, res, next) {
  if(req.params.id==='reservations') {
    exports.list(req, res, next);
  } else if(req.params.id==='new') {    
    return res.json(new Reservation());
  } else {
    Reservation.findById( req.params.id, function (err, reservation) {
      //If user is not logged in user or an admin, don't show this
      if(!req.session.user || 
         reservation.user.toString() !== req.session.user._id ) { //here, we use user.toString() b/c user is an ObjectId object and user.id is showing in unicode for some reason, breaking the logic. To see use the debugger.
        return next(new Error("User not authenticated")); //OR utils.forbidden( res );??????
      }
      res.json(reservation);    
    });
  }
}

exports.save = function(req, res, next) {
  Reservation.findById(req.body._id, function(err, reservation) {

    if(reservation) {  
      reservation.save( function(err, reservation, count) {
        if (err) { 
          return next(err);
        };
        return res.json(reservation);
      });
    } else if(req.session.user._id) {
      
      //Reservation doesn't exist yet, so create a new one
      new Reservation({
        user: req.session.user._id
      }).save( function (err, reservation, count) {
        if (err) { 
          return next(err);
        };    
        return res.json(reservation);
      });
    } else {
      return next(new Error("No reservation to create or update"));
    }
  });
}

exports.delete = function(req, res, next) {
  Reservation.findById( req.params.id, function ( err, reservation ) {
    res.json(true);
  });
}
