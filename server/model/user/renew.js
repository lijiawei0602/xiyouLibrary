var request = require("request");
var iconv = require("iconv-lite");
var cheerio = require("cheerio");

module.exports = function(session, bookInfo, callback){
    if(session == '' || session == null){
        callback(true, "Not Login");
        return;
    }
    var options = {
        url: 'http://222.24.3.7:8080/opac_two/reader/jieshuxinxi.jsp',
        method: "POST",
        headers: {
            "cookie": session,
            "content-type": "application/x-www-form-urlencoded"
        },
        encoding: null,
        form: {
            action: "Renew",
            book_barcode: bookInfo.barcode,
            department_id: bookInfo.department_id,
            library_id: bookInfo.library_id
        }
    };

    request(options, function(err, res, body){
        if(err){
            callback(true, err);
            return;
        }

        body = iconv.decode(body, "GBK");
        var $ = cheerio.load(body);
        var temp = $('#my_lib_jieyue').next();
        var alertStr = temp[0].children[0].data.trim();
        if(alertStr.indexOf("续借失败") !== -1){
            callback(true, "Renew Failed");
            return;
        }else if(alertStr.indexOf("续借成功") !== -1){
            var date = alertStr.substr(alertStr.length - 10).replace(/\//g, '-');
            callback(false, date);
        }
    })
}