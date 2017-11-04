var express = require("express");
var bodyParser = require("body-parser");    //解析HTTP请求头

var user = require("./routes/user.js");
var book = require("./routes/book.js");

var app = express();

app.use(bodyParser.json());         //解析json数据格式 content-type: application/json
app.use(bodyParser.urlencoded({ extended: false }));   //解析form表单提交的数据 content-type: application/x-www-from-urlencoded

app.use("/user", user);
app.use("/book", book);



app.set("port", process.env.PORT || 12000);

var server = app.listen(app.get("port"), function () {
    console.log('running at http://127.0.0.1:' + app.get("port"));
});