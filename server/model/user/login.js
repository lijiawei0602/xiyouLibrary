var request = require('request');
var iconv = require('iconv-lite');

module.exports = function(username, password, callback) {
    if (username == '' || password == '') {
        callback(true, 'Account Error');
        return;
    }

    var options = {
        url: 'http://222.24.3.7:8080/opac_two/include/login_app.jsp',
        method: 'POST',
        encoding: null,
        headers: {
            ContentType: 'application/x-www-form-urlencoded'
        },
        form: {
            login_type: 'barcode',
            barcode: username,
            password: password,
            _: ''
        }
    };

    request(options,
        function (err, res, body) {
            if (err) {
                callback(true, err);
                return;
            } 
            body = iconv.decode(body, "utf-8");
            session = res.headers['set-cookie'];

            if (body == 'ok') {
                callback(false, session[0]);
                return;
            }
            else {
                callback(true, 'Account Error');
                return;
            }
        });
}