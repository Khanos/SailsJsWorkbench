/**
 * BingadsController
 *
 * @description :: Server-side logic for managing bingads
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	access: function(req, res) {
        var data = {};
        BingAdsService.genAuthData(14, function(oauth_data){
            res.view('bingads/bingads', {data: oauth_data});
        });
    }
};
