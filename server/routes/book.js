var express = require("express");
var router = express.Router();
var parse = require("../model/parse.js");


var search = require("../model/book/search.js");
var detail = require("../model/book/detail.js");
var rank = require("../model/book/rank.js");

router.use("/search", function(req,res){
    var keyword = req.query.keyword,
        suchen_type = req.query.wordType || 1,
        suchen_match = req.query.matchMethod || 'qx',
        recordType = req.query.recordType || 'all',
        library_id = 'all',
        show_type = 'wenzi',
        size = req.query.size || 20,
        page = req.query.page || 1,
        ordersc = req.query.ordersc || 'desc',
        orderby = req.query.orderby || 'pubdate_date',
        images = req.query.images || 0;

    if(page < 1){
        page = 1;
    }
    if(size < 20){
        size = 20;
    }

    var info = {
        search_no_type: 'Y',
        snumber_type: 'Y',
        suchen_word: keyword,
        suchen_type: suchen_type,
        suchen_match: suchen_match,
        recordtype: recordType,
        library_id: library_id,
        show_type: show_type,
        "size": size,
        "searchtimes": 1,
        "pagesize": size,
        "page": page,
        "ordersc": ordersc,
        "orderby": orderby,
        "kind": 'simple',
        "curpage": page,
        "images": images
    };

    search(info, function(err, result){
        parse(err, res, result);
    });
});

router.use("/detail/id/:id", function(req,res){
    var id = req.params.id;
    detail.byID(id, function(err, result){
        parse(err, res, result);
    });
});

router.use("/rank", function(req,res){
    var type = req.query.type || 1;
    var size = req.query.size || 10;
    rank(type, size, function(err, result){
        parse(err, res, result);
    });
});

module.exports = router;