// Look in node_modules/mongoose/examples/schema.js for examples
(function() {
  var PropertySchema, mongoose, User, validatePresenceOf, enumRateType, enumCurrencyType;

  mongoose = require("../node_modules/mongoose");
  User = require('./User').User;

  validatePresenceOf = function(value) {
    return value && value.length;
  };

  // LATER make this function work together with the month field
  validateDay = function(value) {
    if(!(value && value.length)) {
      return false;
    }
    
    if(value<1) {
      return false;
    }
    
    if(value>31) {
      return false;
    }
    
    return true;
  };

  Object.size = function(obj) {
      var size = 0, key;
      for (key in obj) {
          if (obj.hasOwnProperty(key)) size++;
      }
      return size;
  };

  propertyRateTypeEnum = {'BASE': 0, 'SEASONAL': 1, 'EVENT': 2};//The higher number trumps the lower number
  propertyRateCurrencyTypeEnum = {'DOLLAR': 0, 'EURO': 1};

//Can I use enum like below so that I can access and use it outside this file too:
// my.namespace.ColorEnum = {
//     RED : 0,
//     GREEN : 1,
//     BLUE : 2
// }
// if(currentColor == my.namespace.ColorEnum.RED) {
//    // whatever
// }  
  
  PropertySchema = new mongoose.Schema({
    name: {
      type: String,
      validate: [validatePresenceOf, 'a name is required']
//      , index: {
//        unique: true
//      }
    },
    slug: { type: String, lowercase: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: User},
    rates: [{
      type: { type: Number, min: 0, max: Object.size(propertyRateTypeEnum)},//enum: propertyRateTypeEnum },
      name: { type: String, validate: [validatePresenceOf, 'a name is required'] },
      from: { 
        day: { type: Number, validate: [validateDay, 'invalid day of the month'] },
        month: { type: Number, min: 1, max: 12 },
        year: { type: Number }
        },
      to: { 
        day: { type: Number, validate: [validateDay, 'invalid day of the month'] },
        month: { type: Number, min: 1, max: 12 },
        year: { type: Number }
        },
      stayRates: [{//For stays more than minStay, the corresponding amount applies. If minStay=0 => that applies by default
        minStay: { type: Number, min: 0 },
        amount: { type: Number, min: 0 }
        }],
      dayRates: [{//For stays on specific days, the corresponding amount applies, if the total stay is less than forStayLT.
        wkDay: { type: Number, min: 1, max: 7 },//Days of the week mon:1...sun:7
        amount: { type: Number, min: 0 },
        forStayLT: { type: Number, min: 2 } // forStayLessThan means, apply it only for stays less than X nights
        }],
      currency:   { type: Number, min: 0, max: Object.size(propertyRateCurrencyTypeEnum) },
      amount:     { type: Number },
      description:{ type: String } //Winter, Summer, High, Low, New Year's, etc.
    }],
    created_on: { type: Date, "default": Date.now }
  });


  /**
   * Plugins
   */

  function slugGenerator (options){
    options = options || {};
    var key = options.key || 'name';

    return function slugGenerator(schema){
      schema.path(key).set(function(v){
        this.slug = v.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/-+/g, '');
        return v;
      });
    };
  };

  PropertySchema.plugin(slugGenerator());


  exports.Property = mongoose.model('Property', PropertySchema, 'property');
}).call(this);
