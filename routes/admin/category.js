var express = require('express');
var router = express.Router();
var co = require('co');
var assert = require('assert');

router.get('/', function (req, res, next) {

    co(function* () {
        var col = req.db.collection("category");

        var docs = yield col.find({}).toArray();
        
        res.render('admin/category', {
            r: docs
        });
    }).catch(err => {
        console.log(err);
    })
})

module.exports = router;
