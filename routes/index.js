var express = require('express');
var router = express.Router();
var co = require('co');
var assert = require('assert');

router.get('/', function (req, res, next) {

    co(function* () {
        var col = req.db.collection("product");

        var docs = yield col.find({}).toArray();

        res.render('index', {
            r: docs
        });
    }).catch(err => {
        console.log(err);
    })
})

router.get('/mysql', function (req, res, next) {

    co(function* () {
        yield req.mquery('_product_list', [0,100,null,100]).then(r => res.render('mysql', {r}))
    }).catch(err => console.log(err))
    
})

module.exports = router;
