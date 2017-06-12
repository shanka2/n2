var fs = require('fs');
var express = require('express');
var router = express.Router();
var co = require('co')

router.get('/', function (req, res, next) {

    co(function* () {
        
        yield req.mquery(req._table() + '_list', [
            100
        ]).then(r => req.axios ? res.json({r}) : res.render('admin/category', {r}))

    }).catch(err => console.log(err))
    
})

router.post('/save', function (req, res, next) {
    
    co(function* () {
        
        //console.log(req.body.q);
        
        yield req.mquery(req._table() + '_save', [req.body.q])

        res.redirect(req.get('referer'))
        
    }).catch(err => console.log(err))
    
})

module.exports = router;
