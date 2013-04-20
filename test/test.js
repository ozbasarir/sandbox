require('should');

var assert = require("assert"),
    mongoose = require('mongoose'),
    settings = require('../settings'),
    Property = require('../models/Property').Property, 
    Owner = require('../models/Owner').Owner;

describe('models', function() {
  beforeEach(function() {
    return mongoose.connect(settings.mongo.url);
  });
  afterEach(function() {
    return mongoose.connection.close();
  });
  describe('creating rentals', function() {
    before(function() {
      return Property.remove({name: 'studiom'}, function(err, data) {});
    });
    return it('save() should create a new rental', function(done) {

      Owner.findById('5143ca018b7149aa44000001', function (err, owner) {

        var rental;
        rental = new Property({
          name: 'studiom'
        });

        rental.owner = owner._id;
        
        var startDate = new Date(2015, 10, 15);
        var endDate = new Date(2015, 10, 17);
        
        rental.rates.push({
          type: 'Nightly',
          startDate: startDate,
          endDate: new Date(2015, 10, 17),
          currency: 'dollar',
          amount: 123
        });
        return rental.save(function(err, data) {
          return Property.findById(rental._id, function(err, document) {
            document.name.should.eql('studiom');
            document.rates[0]['type'].should.eql('Nightly');
            return document.remove(function(err, data) {
              return done(err);
            });
          });
        });
      });
    });
  });

});
//Also, check out exegis's Routes test: https://github.com/aglover/exegesis/blob/master/test/RoutesTest.coffee
  //   describe('finding words', function() {
  //     before(function() {
  //       var word;
  //       word = new models.Word({
  //         spelling: 'nefarious'
  //       });
  //       word.synonyms.push('evil');
  //       word.synonyms.push('menacing');
  //       word.definitions.push({
  //         definition: 'extremely wicked or villainous; iniquitous.',
  //         part_of_speech: 'adjective',
  //         example_sentence: 'he is an extremmely nefarious man'
  //       });
  //       return word.save(function(err, data) {});
  //     });
  //     it('findOne should return one', function(done) {
  //       return models.Word.findOne({
  //         spelling: 'nefarious'
  //       }, function(err, document) {
  //         document.spelling.should.eql('nefarious');
  //         document.definitions.length.should.eql(1);
  //         document.synonyms.length.should.eql(2);
  //         document.definitions[0]['part_of_speech'].should.eql('adjective');
  //         return done(err);
  //       });
  //     });
  //     it('find should return and array with one doc', function(done) {
  //       return models.Word.find({
  //         spelling: 'nefarious'
  //       }, function(err, documents) {
  //         documents[0].spelling.should.eql('nefarious');
  //         documents[0].definitions.length.should.eql(1);
  //         documents[0].synonyms.length.should.eql(2);
  //         documents[0].definitions[0]['part_of_speech'].should.eql('adjective');
  //         documents[0].definitions[0]['example_sentence'].should.eql('he is an extremmely nefarious man');
  //         return done(err);
  //       });
  //     });
  //     it('finding by definition should return the entire word doc', function(done) {
  //       return models.Word.find({
  //         'definitions.definition': 'extremely wicked or villainous; iniquitous.'
  //       }, function(err, documents) {
  //         documents[0].spelling.should.eql('nefarious');
  //         documents[0].definitions.length.should.eql(1);
  //         documents[0].synonyms.length.should.eql(2);
  //         documents[0].definitions[0]['part_of_speech'].should.eql('adjective');
  //         documents[0].definitions[0]['example_sentence'].should.eql('he is an extremmely nefarious man');
  //         return done(err);
  //       });
  //     });
  //     return after(function() {
  //       return models.Word.remove({
  //         spelling: 'nefarious'
  //       }, function(err, data) {});
  //     });
  //   });
  //   return describe('updating words', function() {
  //     before(function() {
  //       var word;
  //       word = new models.Word({
  //         spelling: 'loquacious'
  //       });
  //       word.synonyms.push('verbose');
  //       word.definitions.push({
  //         definition: 'talking or tending to talk much or freely; talkative; chattering; babbling; garrulous.',
  //         part_of_speech: 'adjective'
  //       });
  //       return word.save(function(err, data) {});
  //     });
  //     it('update should be able to add another another definition', function(done) {
  //       var newDefinition;
  //       newDefinition = {
  //         definition: 'characterized by excessive talk; wordy: easily the most loquacious play of the season',
  //         part_of_speech: 'adjective'
  //       };
  //       return models.Word.update({
  //         spelling: 'loquacious'
  //       }, {
  //         $push: {
  //           definitions: newDefinition
  //         }
  //       }, {
  //         multi: false
  //       }, function(err, num) {
  //         num.should.eql(1);
  //         return models.Word.findOne({
  //           spelling: 'loquacious'
  //         }, function(err, document) {
  //           document.definitions.length.should.eql(2);
  //           return done(err);
  //         });
  //       });
  //     });
  //     return after(function() {
  //       return models.Word.remove({
  //         spelling: 'loquacious'
  //       }, function(err, data) {});
  //     });
  //   });
  // });
