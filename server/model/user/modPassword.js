var request = require("request");
var iconv = require("iconv-lite");

module.exports = function(session, info, callback){
    if(session == '' || session == null){
        callback(true, "Not Login");
        return;
    }
    var options = {
        url: 'http://222.24.3.7:8080/opac_two/reader/updatepwd.jsp',
        method: "POST",
        encoding: null,
        headers: {
            "cookie": session
        },
        form: info
    }
    request(options, function(err, res, body){
        if(err){
            callback(true, err);
            return;
        }
        body = iconv.decode(body, "GB2312").trim();
        if(body.indexOf("修改成功") !== -1){
            callback(false, "Modify Success");
            return;
        }else if(body.indexOf("旧密码不正确") !== -1){
            callback(true, "旧密码不正确");
            return;
        }else if(body.indexOf("新密码两次输入不一致") !== -1){
            callback(true, "两次密码输入不一致");
            return;
        }else{
            callback(true, "Modify Failed");
            return;
        }
    })
}