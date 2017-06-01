var express = require('express');
var router = express.Router();
var co = require('co')

router.get('/', function (req, res, next) {

    co(function* () {
        yield req.mquery('_img_list', [
            100
        ]).then(r => {

            if(req.axios){
                res.json({r})
            } else {
                res.render('test', {r})
            }
        })
    }).catch(err => console.log(err))
    
})

router.post('/insert', function (req, res, next) {

    co(function* () {
        var idx
        yield req.mquery('_img_insert', []).then(r => {idx = r.r[0].idx})

        res.json({idx: idx})

    }).catch(err => console.log(err))
    
})

router.post('/update', function (req, res, next) {

    co(function* () {
        
        res.json({idx: req.body.idx})

    }).catch(err => console.log(err))
    
})

router.post('/delete', function (req, res, next) {

    co(function* () {
        
        yield req.mquery('_img_update_state', [req.body.idx, 0])
        
//        res.redirect(req.get('referer'))
        res.json({idx: req.body.idx})

    }).catch(err => console.log(err))
    
})


router.post('/img', require('./img')('_img_update_imgs'), function (req, res, next) {

    res.redirect(req.get('referer'))
    
})

module.exports = router;
