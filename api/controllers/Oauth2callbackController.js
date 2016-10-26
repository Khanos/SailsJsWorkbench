/**
 * Oauth2callbackController
 *
 * @description :: Server-side logic for managing oauth2callbacks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

// BingAds returned: https://gb-lcl.dboards.co:1337/oauth2callback?code=M948acccc-96e7-2236-23b3-8df4fbb61bcd&state=200
module.exports = {
	bingads: function (req, res) {
        var code = req.query.code;
        BingAdsService.codeExchange(14, code, function (info) {
            res.view('oauth2callback', {message:'The authorization has been granted'});
        });
    }
};
