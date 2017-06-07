var fs = require('fs');
var express = require('express');
var router = express.Router();
var co = require('co')

router.get('/', function (req, res, next) {

    co(function* () {
        yield req.mquery('_menu_list', [
            100
        ]).then(r => {

            if(req.axios){
                res.json({r})
            } else {
                res.render('admin/index', {r})
            }
        })
    }).catch(err => console.log(err))
    
})


module.exports = router;
