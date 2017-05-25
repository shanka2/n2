var express = require('express');
var router = express.Router();
var co = require('co');
var fs = require('fs');
var assert = require('assert');

router.get('/', function (req, res, next) {

    co(function* () {
        
        yield req.mquery('_img_list', []).then(r => res.render('test', {r}))
        
    }).catch(err => console.log(err))
    
})

router.post('/', function (req, res, next) {

    co(function* () {
        
        f = req.rename("files")
        
        var imgs = []
        
        for(i in f) {

            imgs[i] = f[i].new_name
            
            yield req.thumb(f[i].x, 100)
            yield req.thumb(f[i].x, 200)
        }

        yield req.mquery('_img_insert', [imgs.join()])
        yield req.mquery('_img_list', []).then(r => res.json({r}))
        
    }).catch(err => console.log(err))
    
})

module.exports = router;
























