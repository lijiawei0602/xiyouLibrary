var express = require("express");
var router = express.Router();
var parse = require("../model/parse.js");

var login = require("../model/user/login.js");
var info = require("../model/user/info.js");
var rent = require("../model/user/rent.js");
var renew = require("../model/user/renew.js");
var modifyPassword = require("../model/user/modPassword.js");
var history = require("../model/user/history");

router.use("/login", function(req,res){
    var username = req.query.username;
    var password = req.query.password;
    login(username, password, function(err, result){
        parse(err, res, result);
    })
});

router.use("/info", function(req,res){
    var session = req.query.session;
    info(session, function(err, result){
        parse(err, res, result);
    });
});

router.use("/rent", function(req,res){
    var session = req.query.session;
    rent(session, function(err, result){
        parse(err, res, result);
    });
});

router.use("/renew", function(req,res){
    var session = req.query.session;
    var bookInfo = {
        barcode: req.query.barcode,
        department_id: req.query.department_id,
        library_id: req.query.library_id
    };
    renew(session, bookInfo, function(err, result){
        parse(err, res, result);
    });
});

router.use("/modifyPassword", function(req,res){
    var session = req.query.session;
    var info = {
        str_reader_pwd: req.query.password,
        str_reader_pwd_new: req.query.newPassword,
        str_reader_pwd_new_re: req.query.rePassword,
        str_reader_barcode: req.query.username
    };
    modifyPassword(session, info, function(err, result){
        parse(err, res, result);
    });
});

router.use("/history", function(req,res){
    var session = req.query.session;
    history(session, function(err, result){
        parse(err, res, result);
    });
})

module.exports = router;