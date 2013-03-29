var Owner = require('../models/Owner').Owner;
var querystring = require('querystring')
  , https = require('https')
  , settings= require('../settings');

exports.index = function(req, res){
  res.render('index', {
    settings: settings
  });
};
// 
// exports.login = function(req, res){
//   if(req.session.user) {
//     res.redirect('/');
//   } else {
//     res.render('partials/owner/login', {
//       settings: settings
//     });
//   }
// };

exports.serverLogout = function(req, res){
  req.session.destroy(function(){
    return res.redirect('/');
  });
}

exports.partials = function(req, res){
  res.render('partials/' + req.params.module + '/' + req.params.partial, {
    settings: settings
  });
};

function authenticateWithRpxId(rpx_identifier, fn) {
  Owner.findOne({'third_party_id': rpx_identifier}, function(err, owner){
    fn(err, owner);
  });
}

function addNewUser(userData, fn) {
  var name = userData.profile.name.formatted;
  var first = '', last = '';
  
  nameParts = name.split();
  if(nameParts.length > 1) {
    last = nameParts[nameParts.length-1];
    first = nameParts.slice(0, -1).toSource();
  } else {
    first = name;
  }

  if(userData.profile.verifiedEmail) {
    var email = userData.profile.verifiedEmail;
  } else if(userData.profile.email) {
    var email = userData.profile.email;
  } else {
    return fn("No email. Cannot create owner.", null);
  }
  
  new Owner({
    name: {
      first: first,
      last: last
    },
    email: email,
    third_party_id: userData.profile.identifier,
  }).save( function (err, owner, count) {
    if (err) { 
      console.error(err);
      fn(err, null);
    }

    fn(null, owner);
  });  
}

function startUserSession(user, req, fn) {
  req.session.regenerate(function(){
    // Store the user's primary key in the session store to be retrieved,
    // or in this case the entire user object
    req.session.user = user;
    req.session.success = 'Authenticated as ' + user.name
      + ' click to <a href="/logout">logout</a>. '
      + ' You may now access <a href="/restricted">/restricted</a>.';
console.log("in startUserSession with: "+user.name);

    fn();
  });
}

exports.janrainToken = function(req, res, next) {
  var token = req.body.token;
  
  if(token.length < 1) {
    return res.redirect('/partials/owner/partial/login');
  }
  
  var rpx_post = querystring.stringify({
    apiKey: 'a47ccc9539e6271b746a4d55a9ed7847732d5586',
    token: token
  });
  
  var rpx_options = { //https://rpxnow.com/api/v2/auth_info
    hostname: 'rpxnow.com',
    port: 443,
    path: '/api/v2/auth_info',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': rpx_post.length
    }
  };

  var rpx_req = https.request(rpx_options, function(rpx_res) {
    //console.log("statusCode: ", res.statusCode);
    //console.log("headers: ", res.headers);
    rpx_res.setEncoding('utf8');
    rpx_res.on('data', function(chunk) {
      rpx_chunk = JSON.parse(chunk);
      authenticateWithRpxId(rpx_chunk.profile.identifier, function(err, user) {
        if(user) {
          userObj = user.toObject();
          if(userObj.third_party_id) {
            startUserSession(userObj, req, function(){
console.log("redirecting to dashboard");
              res.redirect('/');//maps to owner's index
            });
          }
        } else {
          //req.session.error = 'Authentication failed. Could not find user.';
          //Just create a new user here
          addNewUser(rpx_chunk, function(err, new_user) {
            if(err) {
              return next(err);
            } else {
              userObj = new_user.toObject();
              startUserSession(userObj, req, function(){
console.log("redirecting to /owners");
                res.redirect('/owners');
              });
            }
          });
        }

      });

    });
  });
  rpx_req.write(rpx_post);
  rpx_req.end();

  rpx_req.on('error', function(e) {
    console.error(e);
  });

// {
//   'stat': 'ok',
//   'profile': {
//     'identifier': 'http://user.myopenid.com/',
//     'email': 'user@example.com',
//     'preferredUsername': 'Joe User'
//    }
// }
//   Using the return value, sign the user in with the 'identifier' param in the response.
}

