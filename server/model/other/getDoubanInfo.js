var request = require("request");
var iconv = require("iconv-lite");
var cheerio = require("cheerio");

var dbOperation = require("../mongoDB/dbOperation.js");

module.exports = function(id, isbn, callback){
    dbOperation.getFromDB(id, function(err, result){
        if(err){
            callback(true, null);
            return;
        }else{
            if(!result){
                var options = {
                    url: `https://api.douban.com/v2/book/isbn/${isbn}`,
                    method: 'GET'
                };

                request(options, function(err, res, body){
                    if(err){
                        callback(true, err);
                        return;
                    }
                    try{
                        var doubanInfo = JSON.parse(body);
                        if(doubanInfo.code === 6000){
                            callback(true, null);
                            return;
                        }
                        callback(false, doubanInfo);
                        dbOperation.writeToDB({ ID: id, ISBN: isbn, DoubanInfo: body }, function(err, result){
                        })
                    }catch(err){
                        console.log(err);
                    }
                })
            }else{
                try{
                    callback(false, JSON.parse(result));
                }catch(err){
                    console.log(err);
                }
            }
        }
    })
}