var fs = require('fs');
var express = require('express');
var router = express.Router();
var co = require('co')
var assert = require('assert')
var async = require('async')
var im = require('imagemagick')

router.get('/', function (req, res, next) {

    co(function* () {
        yield req.mquery('_product_list', [
            req.prev_size,
            req.page_size,
            req.s_value,
            100
        ]).then(r => {
            if(req.axios){
                res.json({r});
            } else {
                res.render('admin/product', {r})
            }
        })
    }).catch(err => console.log(err))
    
})

router.post('/insert', function (req, res, next) {

    co(function* () {
        var idx
        yield req.mquery('_product_insert', [
            req.body.name,
            req.body.price,
            req.body.price,
            req.body.description,
            100
        ]).then(r => {idx = r[0].r})

        for(i in req.body.opt) {
            yield req.mquery('_product_sub_insert', [
                idx,
                req.body.opt1_name,
                req.body.opt2_name,
                req.body.opt[i].opt1,
                req.body.opt[i].opt2
            ])
        }
        
//        res.redirect(req.get('referer'))
        res.json({idx: idx})

    }).catch(err => console.log(err))
    
})

router.post('/delete', function (req, res, next) {

    co(function* () {
        
        yield req.mquery('_product_update_state', [req.body.idx, 0])
        
        res.redirect(req.get('referer'))

    }).catch(err => console.log(err))
    
})


router.post('/img', function (req, res, next) {

    co(function* () {
        
        f = req.rename("files")
        
        var imgs = []
        
        for(i in f) {

            imgs[i] = f[i].new_name
            
            yield req.thumb(f[i].x, 100)
            yield req.thumb(f[i].x, 200)
        }

        yield req.mquery('_product_update_imgs', [req.body.idx, imgs.join()])
        
        res.redirect(req.get('referer'))
        
    }).catch(err => console.log(err))
    
})

module.exports = router;
