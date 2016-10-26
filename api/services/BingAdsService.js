var request = require('request');
var url = require('url');
var AUTHORIZE_OAUTH_URL = 'https://login.live.com/oauth20_authorize.srf';
var LOGOUT_OAUTH_URL = 'https://login.live.com/oauth20_logout.srf';
var TOKEN_OAUTH_URL = 'https://login.live.com/oauth20_token.srf';
var SCOPES = 'bingads.manage';
var RESPONSE_TYPE = 'code';
var REDIRECT_URI = 'http://localhost:1337/oauth2callback/bingads';//'http://gb-lcl.dboards.co:1337/oauth2callback';
var STATE = 200;

// api/services/GoogleauthService.js
module.exports = {

    genAuthData: function(user_id, next) {
        var oauth_data = {};
        var user_data = {};
        var credentials = {};
        User.find({id: user_id}, function (err, data) {
            if (err) console.log(err);
            user_data = data;
            Credentials.find({}, function(err, data) {
                if (err) console.log(err);
                credentials = data;
                var options = {
                    url: TOKEN_OAUTH_URL,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    form: {
                        client_secret: credentials[0].password,
                        client_id: credentials[0].client_id,
                        grant_type: 'refresh_token',
                        redirect_uri: REDIRECT_URI,
                        refresh_token: user_data[0].refresh_token
                    }
                };
                request(options, function (err, response, body) {
                    console.log(response.body);
                    console.log(response.statusCode);
                    if (!err && response.statusCode == 200) {
                        var info = JSON.parse(body);
                        oauth_data.access_token = info.access_token;
                        oauth_data.isAuthenticated = true;
                        oauth_data.url = url.format(LOGOUT_OAUTH_URL+'?'+
                            'client_id='+credentials[0].client_id+'&'+
                            'redirect_uri='+REDIRECT_URI);
                        next(oauth_data);
                    } else if (!err && response.statusCode == 400) {
                        oauth_data.access_token = null;
                        oauth_data.isAuthenticated = false;
                        oauth_data.url = url.format(AUTHORIZE_OAUTH_URL+'?'+
                                    'client_id='+credentials[0].client_id+'&'+
                                    'scope='+SCOPES+'&'+
                                    'response_type='+RESPONSE_TYPE+'&'+
                                    'redirect_uri='+REDIRECT_URI+'&'+
                                    'state='+STATE);
                        next(oauth_data);
                    }
                });
            });
        });
    },

    codeExchange: function(id, code, next) {
        Credentials.find({}, function(err, data) {
            if (err) console.log(err);
            var options = {
                url: TOKEN_OAUTH_URL,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                form: {
                    code: code,
                    client_secret: data[0].password,
                    client_id: data[0].client_id,
                    grant_type: 'authorization_code',
                    redirect_uri: REDIRECT_URI
                }
            };
            request(options, function (err, response, body) {
                if (!err && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    User.update({id: id}, {
                        access_token: info.access_token,
                        refresh_token: info.refresh_token
                    }).exec(function afterwards(err, updated) {
                        if (err) {
                            res.serverError(err);
                        }
                        console.log('Updated user to have name ' + updated[0]);
                        next();
                    });
                }
            });
        });
    }
};
