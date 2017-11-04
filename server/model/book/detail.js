var request = require("request");
var iconv = require("iconv-lite");
var cheerio = require("cheerio");

var getDoubanInfo = require("../other/getDoubanInfo.js");

function byID(id, callback){
    if(id == '' || id == null){
        callback(true, null);
        return;
    }
    var options = {
        url: "http://222.24.3.7:8080/opac_two/search2/s_detail.jsp?sid=" + id,
        method: "GET",
        encoding: null
    };

    request(options, function(err, res, body){
        if(err){
            callback(true, err);
            return;
        }
        body = iconv.decode(body, "GB2312");
        var $ = cheerio.load(body);
        if($("div#tianqi").length !== -1){
            if($("div#tianqi").text().trim() == "该记录控制号无效！"){
                callback(true, null);
                return;
            }
        }

        var $$ = cheerio.load($("td[width=670]").html());

        var ISBN, Pub, Title, Author, Sort = "";
        var SecondTitle = "";
        var Form = "";
        var Subject = "";
        var Summary = "";
        $$("tr").each(function(i, e){
            var pageBaseInfo = $$(e).text().trim().split(" : ");
            if(pageBaseInfo.length == 1){
                pageBaseInfo = ($$(e).text().trim()).split(':');
            }

            switch(pageBaseInfo[0].trim()){
                case '标准书号':
                case 'ISBN/ISSN':
                    ISBN = pageBaseInfo[1].replace(/-/g, '').trim();
                    break;
                case '并列提名':
                    SecondTitle = pageBaseInfo[1].trim();
                    break;
                case '出版社':
                case '出版':
                    Pub = pageBaseInfo[1].trim();
                    break;
                case '简介':
                case '摘要':
                    Summary = pageBaseInfo[1].trim();
                    break;
                case '题名':
                case '题名和责任者说明':
                    Title = pageBaseInfo[1].split("/")[0].trim();
                    break;
                case '载体形态':
                    Form = pageBaseInfo[1].trim();
                    break;
                case '责任者':
                    Author = pageBaseInfo[1].trim();
                    break;
                case '分类号':
                case '中图分类号':
                    Sort = pageBaseInfo[1].trim();
                    break;
                case '主题词':
                case '主题':
                    Subject = pageBaseInfo[1].trim();
                    break;
            }
        });

        if(Author != null){
            if(Author.lastIndexOf(",") == Author.length-1){
                Author = Author.substring(0, Author.length-1);
            }
        }else{
            Author = "";
        }

        var baseInfo = {
            ID: id,
            ISBN: ISBN,
            SecondTitle: SecondTitle,
            Pub: Pub,
            Summary: Summary,
            Title: Title,
            Form: Form,
            Author: Author,
            Sort: Sort,
            Subject: Subject,
            RentTimes: 0,
            FavTimes: 0,
            BrowseTimes: 0,
            Total: 0,
            Available: 0,
            CirculationInfo: [],
            ReferBooks: [],
            DoubanInfo: null
        };

        $$ = cheerio.load($('td[width=181]').html().replace(/td_color_1/g, 'td_color_2'));
        var rentTimes, favTimes, browseTimes;
        $$('tr.td_color_2').each(function (i, e) {
            switch (i) {
                case 0:
                    rentTimes = (($$(e).text()).split('：')[1].trim()) * 1;
                    baseInfo.RentTimes = rentTimes;
                    break;
                case 1:
                    favTimes = (($$(e).text()).split('：')[1].trim()) * 1;
                    baseInfo.FavTimes = favTimes;
                    break;
                case 2:
                    browseTimes = (($$(e).text()).split('：')[1].trim()) * 1;
                    baseInfo.BrowseTimes = browseTimes;
                    break;
            }
        });

        $$ = cheerio.load($('td[width=788]').html().replace(/td_color_1/g, 'td_color_2'));
        var canRent = 0;
        $$('tr.td_color_2').each(function (i, e) {
            if (i != 0) {
                var temp = $$(e).text().trim().replace(/\t/g, '').replace(/ /g, '').split('\r\n');
                temp.splice(0, 1);
                temp.splice(2, 1);
                if (temp[4] == undefined) {
                    temp[4] = null;
                    canRent++;
                }
                var circulationItem =
                {
                    'Barcode': temp[0],
                    'Sort': temp[1],
                    'Department': temp[2],
                    'Status': temp[3],
                    'Date': temp[4]
                };
                baseInfo.CirculationInfo.push(circulationItem);
            }
        });
        baseInfo.Total = baseInfo.CirculationInfo.length;
        baseInfo.Available = canRent;

        $$ = cheerio.load($('div#s_detail_xiangguan').html().replace(/td_color_1/g, 'td_color_2'));
        var referBook = new Array();
        var id, title, author;
        $$('td[width="60%"]').each(function (i, e) {
            if (i % 2 == 0) {
                var idt = $$(e).children()[0].attribs['href'];
                id = idt.substr(idt.indexOf('=') + 1);
                title = $$(e).children()[0].children[0].data;
            } else {
                author = $$(e).text();
                if(author != null){
                    if(author.lastIndexOf(',')==author.length-1){
                        author = author.substring(0,author.length-1);
                    }
                }
                else{
                    author = "";
                }
                
                referBook.push
                (
                    {
                        ID: id,
                        Title: title,
                        Author: author
                    }
                );
            }
        });
        baseInfo.ReferBooks = referBook;
        var doubanInfo;

        getDoubanInfo(id, ISBN, function(err, result){
            if(result == null){
                doubanInfo = null;
            }else{
                doubanInfo = {
                    Rating: result.rating,
                    Author: result.author,
                    PubDate: result.pubdate,
                    Binding: result.binding,
                    Pages: result.pages,
                    Images: result.images,
                    Publisher: result.publisher,
                    ISBN10: result.isbn10,
                    ISBN13: result.isbn13,
                    Title: result.title,
                    Alt_Title: result.alt_title,
                    Author_Info: result.author_intro,
                    Summary: result.summary,
                    Price: result.price
                }
                baseInfo.DoubanInfo = doubanInfo;
            }
        })
        callback(false, baseInfo);
    })
}

exports.byID = byID;