(function() {
  var User, dsn, mongoose, populateUsers;

  mongoose = require('mongoose');

  User = require('../models/User').User;

  dsn = "mongodb://localhost/rental";

  mongoose.connect(dsn, function(err) {
    if (err) {
      throw err;
    }
  });

  populateUsers = function() {
    var piggyData, piggyUser;
    console.log("In populateUsers");
    piggyData = {
      name: {
        first: "Piggy",
        last: "D"
      },
      email: "test@testpest.com",
      password: "burla",
      salt: "ABAEBCDCBE"
    };
    piggyUser = new User(piggyData);
    console.log(piggyUser);
    return piggyUser.save(function(err, item) {
      console.log("In save function");
      if (err) {
        return console.log(err);
      } else {
        return console.log(item);
      }
    });
  };

  populateUsers();

}).call(this);
