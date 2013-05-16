// Look in node_modules/mongoose/examples/schema.js for examples
(function() {
  var ReservationSchema, mongoose, User, Rental, validatePresenceOf, enumRateType, enumCurrencyType;

  mongoose = require("../node_modules/mongoose");
  User = require('./User').User;
  Rental = require('./Rental').Rental;
  Contract = require('./Rental').Contract;

  ReservationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: User},
    rental: { type: mongoose.Schema.Types.ObjectId, ref: Rental},
    contract: { type: mongoose.Schema.Types.ObjectId, ref: Contract},
    checkinDate: { type: Date },
    checkinTime: { type: Date }, //split up time for the ease of data entry logic
    checkoutDate: { type: Date },
    checkoutTime: { type: Date}, //split up time for the ease of data entry logic
    adults: { type: Number, min: 1 },
    kids: { type: Number, min: 0 },
    max_guests: { type: Number },
    currency:   { type: Number },
    amount:     { type: Number },
    created_on: { type: Date, "default": Date.now }
  });


  exports.Reservation = mongoose.model('Reservation', ReservationSchema, 'reservation');
}).call(this);
