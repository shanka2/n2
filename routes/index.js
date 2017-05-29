var fs = require('fs');
var express = require('express');
var router = express.Router();
var co = require('co')

router.get('/', function (req, res, next) {

    co(function* () {
        
        res.render('index', {})
        
    }).catch(err => console.log(err))
    
})


module.exports = router;

