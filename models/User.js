(function() {
  var UserSchema, mongoose, validatePresenceOf;

  mongoose = require("../node_modules/mongoose");

  validatePresenceOf = function(value) {
    return value && value.length;
  };

  userRoleEnum = {'MANAGER': 0, 'OWNER': 1, 'ADMIN': 2};
  UserSchema = new mongoose.Schema({
    roles: {
      type: Array,
      "default": [0]
    },
    name: {
      first: String,
      last : String
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: [validatePresenceOf, 'an email is required'],
      index: {
        unique: true,
        sparse: true
      }
    },
    password: String,
    salt: String,
    created_on: {
      type: Date,
      "default": Date.now
    },
    third_party_id: {
      type: String,
      index: {
        unique: true,
        sparse: true
      }      
    }
  });

  exports.User = mongoose.model('User', UserSchema, 'user');

}).call(this);
//Add an eTag or ModifiedDate?