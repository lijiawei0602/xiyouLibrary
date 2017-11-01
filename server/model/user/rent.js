var request = require("request");
var iconv = require("iconv-lite");
var cheerio = require("cheerio");

module.exports = function(session, callback){
    if(session == '' || session == null){
        callback(true, "Not Login");
        return;
    }
    var options = {
        url: "http://222.24.3.7:8080/opac_two/reader/jieshuxinxi.jsp",
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
        body = iconv.decode(body, "GB2312").replace(/td_color_2/g, 'td_color_1');
        var $ = cheerio.load(body);
        var rentArr = [], state, department_id, library_id;

        $('TR[class="td_color_1"]').each(function(i){
            var temp = $(this).children();
            state = $(temp[5]).text().trim();
            var canReNew = true;
            if($(temp[5]).text().trim() == "本馆续借"){
                canReNew = false;
            }

            var jsRaw = temp[7].children[0].attribs['onclick'];
            if(jsRaw == undefined){
                jsRaw = temp[7].children[0].children[0].data;
                if (jsRaw == '过期暂停') {
                    canRenew = false;
                    department_id = null;
                    library_id = null;
                    state = '过期暂停';
                }
            }else{
                jsRaw = jsRaw.substr(jsRaw.indexOf("Renew") + 6).replace(/\);/g, '');
                var jsInfo = jsRaw.replace(/\'/g, '').split(",");
                    department_id = jsInfo[1];
                    library_id = jsInfo[2];
            }
            rentArr[i] = {
                title: $(temp[2]).text().trim(),
                barcode: $(temp[3]).text().trim(),
                department: $(temp[4]).text().trim(),
                state: state,
                date: $(temp[6]).text().trim(),
                canReNew: canReNew,
                department_id: department_id,
                library_id: library_id
            };
        });

        callback(false, rentArr);
    });
}