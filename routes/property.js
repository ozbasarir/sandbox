var Property = require('../models/Property').Property;

exports.list = function(req, res, next){
  Property.
    find().
    sort( '-owner' ).
    exec(function (err, properties) {
      res.json(properties);
    });
};

exports.ownerPropertyList = function(req, res, next){
  Property.
    find().
    sort( '-owner' ).
    exec(function (err, properties) {
      res.json(properties);
    });
};