var User = require('../models/User').User
  , addNewUser = require('../routes/user').save
  , querystring = require('querystring')
  , https = require('https')
  , settings= require('../settings');

// exports.testbed = function(req, res){
//   res.render('testbed');
// }

exports.index = function(req, res){
console.log("server request for / handled");  
  if(req.session.user) {
    res.render('index', {
      settings: settings
    });
  } else {
    res.render('public', {
      settings: settings,
      token_url: req.protocol+'://'+req.host+settings.rpx.token_url
    });
  }
};

exports.serverLogout = function(req, res){
console.log("server request for /server_logout handled");  

  req.session.destroy(function(){
    return res.redirect('/');
  });
}

exports.partials = function(req, res){
console.log("server request for "+req.params.module+"/"+req.params.partial+" handled");  
  res.render('partials/' + req.params.module + '/' + req.params.partial, {
    settings: settings
  });
};

function authenticateWithRpxId(rpx_identifier, fn) {
  User.findOne({'third_party_id': rpx_identifier}, function(err, user){
    fn(err, user);
  });
}

function startUserSession(user, req, fn) {
  req.session.regenerate(function(){
    // Store the user's primary key in the session store to be retrieved,
    // or in this case the entire user object
    req.session.user = user;
    req.session.success = 'Authenticated as ' + user.name
      + ' click to <a href="/logout">logout</a>. '
      + ' You may now access <a href="/">restricted</a> pages.';

    fn();
  });
}

exports.janrainToken = function(req, res, next) {
  var token = req.body.token;
  
  if(token.length < 1) {
    return res.redirect('/public');
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
              res.redirect('/');//maps to user's index
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
console.log("redirecting to user's dashboard");
                res.redirect('/');
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

