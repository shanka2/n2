var express = require('express');
var router = express.Router();
var co = require('co')

router.get('/', function (req, res, next) {

    co(function* () {
        
        yield req.mquery('_product_list', [
            req.prev_size,
            req.page_size,
            req.s_value,
            100
        ]).then(r => req.axios ? res.json({r}) : res.render('admin/product', {r}))
                
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
        ]).then(r => {idx = r.r[0].idx})

        for(i in req.body.opt) {
            yield req.mquery('_product_sub_insert', [
                idx,
                req.body.opt1_name,
                req.body.opt2_name,
                req.body.opt[i].opt1,
                req.body.opt[i].opt2
            ])
        }
        
        res.json({idx: idx})

    }).catch(err => console.log(err))
    
})

router.post('/update', function (req, res, next) {

    co(function* () {
        
        yield req.mquery('_product_update', [
            req.body.idx,
            req.body.name,
            req.body.price,
            req.body.price,
            req.body.description,
            100
        ])

        for(i in req.body.opt) {
            yield req.mquery('_product_sub_insert', [
                req.body.idx,
                req.body.opt1_name,
                req.body.opt2_name,
                req.body.opt[i].opt1,
                req.body.opt[i].opt2
            ])
        }
        
        res.json({idx: req.body.idx})

    }).catch(err => console.log(err))
    
})

router.post('/delete', function (req, res, next) {

    co(function* () {
        
        yield req.mquery('_product_update_state', [req.body.idx, 0])
        
//        res.redirect(req.get('referer'))
        res.json({idx: req.body.idx})

    }).catch(err => console.log(err))
    
})


router.post('/img', require('../common/img')('_product_update_imgs'), function (req, res, next) {

    res.redirect(req.get('referer'))
    
})

module.exports = router;
