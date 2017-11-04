var mongoose = require("mongoose");
var db = mongoose.connect("mongodb://localhost/xiyouLibrary");

var doubanInfoSchema = new mongoose.Schema(
    {
        ID: String,
        ISBN: String,
        DoubanInfo: String
    },
    {
        collection: 'DoubanInfo'
    }
);

var doubanInfoModel = mongoose.model("DoubanInfo", doubanInfoSchema);

function getFromDB(id, callback){
    doubanInfoModel.findOne({ ID: id }, function(err, result){
        if(err){
            callback(true, err);
            return;
        }else if(!result){
            callback(false, null);
            return;
        }else if(result){
            callback(false, result.DoubanInfo);
        }
    });
}

function writeToDB(info, callback){
    var newInfo = new doubanInfoModel(info);
    newInfo.save(function(err){
        if(err){
            callback(true, err);
            return;
        }
        callback(true, 'save success');
    });
};

exports.getFromDB = getFromDB;
exports.writeToDB = writeToDB;