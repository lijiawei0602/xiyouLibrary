var request = require("request");
var iconv = require("iconv-lite");
var cheerio = require("cheerio");

var typeSet =
{
    "1": {Name: "借阅排行榜", Url: "?type=circul.circulog_A&cname=½èÔÄÅÅÐÐ°ñ" },
    "2": {Name: "检索排行榜", Url: "?type=opac.n_search_log&cname=¼ìË÷ÅÅÐÐ°ñ" },
    "3": {Name: "收藏排行榜", Url: "?type=opac.n_collection&cname=ÊÕ²ØÅÅÐÐ°ñ" },
    "4": {Name: "书评排行榜", Url: "?type=opac.n_review&cname=ÊéÆÀÅÅÐÐ°ñ" },
    "5": {Name: "查看排行榜", Url: "?type=opac.n_look_log&cname=²é¿´ÅÅÐÐ°ñ" }
};

module.exports = function(type, size, callback){
    if(type == '' || type == undefined){
        callback(true, "Params Error");
        return;
    }
    if(size < 10 || size > 100){
        size = 10;
    }

    var uri = typeSet[type]["Url"];
    if(uri == '' || uri == undefined || uri == null){
        callback(true, 'Params Error');
        return;
    }
    var options = {
        url: "http://222.24.3.7:8080/opac_two/top/top_detail.jsp" + uri,
        encoding: null
    };
    request(options, function(err, res, body){
        if(err){
            callback(true, err);
            return;
        }
        body = iconv.decode(body, "GB2312").replace(/td_color_2/g, "td_color_1");
        var $ = cheerio.load(body);
        if ($('.top_detail').next().text().indexOf('暂无内容') > -1) {
            callback(true, 'null');
        }

        var info = [];
        $('table[width="812"]').find('tr[class=td_color_1]').each(function (i, element) {
            if (i == size) {
                callback(false, info);
                return;
            }
            if (type == '1') {
                var index=$(this).find('a').attr('href').indexOf('=') + 1;
                info[i] = {
                    Rank: $(this).find('td[align=center]').eq(0).text(),
                    Title: $(this).find('a').text(),
                    Sort: $(this).find('td[align=left]').eq(1).text(),
                    BorNum: $(this).find('td[align=center]').eq(1).text(),
                    ID: $(this).find('a').attr('href').substr(index, 10)
                };
            } else {
                if (type== '2') {
                    info[i] = {
                        Rank: $(this).find('td[align=center]').eq(0).text(),
                        Title: $(this).find('a').text(),
                        BorNum: $(this).find('td[align=center]').eq(1).text()
                    };
                } else {
                    var index=$(this).find('a').attr('href').indexOf('=') + 1;
                    info[i] = {
                        Rank: $(this).find('td[align=center]').eq(0).text(),
                        Title: $(this).find('a').text(),
                        BorNum: $(this).find('td[align=center]').eq(1).text(),
                        ID: $(this).find('a').attr('href').substr(index, 10)
                    };
                }
            }
        });
    })

}