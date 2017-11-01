var request = require("request");
var iconv = require("iconv-lite");
var cheerio = require("cheerio");

module.exports = function(session, callback){
    if(session == '' || session == null){
        callback(true, "Not Login");
        return;
    }
    var options = {
        url: "http://222.24.3.7:8080/opac_two/reader/reader_set.jsp",
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

        var infoTable = $("table[width=600] tbody");
        var id = $(infoTable.children()[0].children[3]).text().trim(),
            name = $(infoTable.children()[3].children[3]).text().trim(),
            from = $(infoTable.children()[8].children[3]).text().trim(),
            to = $(infoTable.children()[9].children[3]).text().trim(),
            readerType = $(infoTable.children()[10].children[3]).text().trim(),
            department = $(infoTable.children()[11].children[3]).text().trim(),
            debt = $(infoTable.children()[12].children[3]).text().trim();
        var userInfo = {
            id,
            name,
            from,
            to,
            readerType,
            department,
            debt
        };

        callback(false, userInfo);
    });
};