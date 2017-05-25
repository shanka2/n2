var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/mall';

module.exports = () => (req, res, next) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log("db is connected");
        req.db = db;
        req.ObjectId = ObjectId;

        next();
    });
};
