module.exports = function(err, res, result){
    if(err){
        res.jsonp({
            result: false,
            data: result
        });
    }else{
        res.jsonp({
            result: true,
            data: result
        })
    }
};