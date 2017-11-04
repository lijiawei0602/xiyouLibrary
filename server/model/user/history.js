var request = require("request");
var iconv = require("iconv-lite");
var cheerio = require("cheerio");

module.exports = function(session, callback){
    if(session == '' || session == null){
        callback(true, "Not Login");
        return;
    }
    var options = {
        url: '',
        method: '',
        encoding: null,
        headers: {
            "cookie": session
        }
    };
    request(options, function(err, res, body){
        if(err){
            callback(true, err);
            return;
        }
        body = iconv.decode(body, "GB2312");
        var $ = cheerio.load(body);
        console.log(body);
    });
}