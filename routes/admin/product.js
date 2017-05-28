var fs = require('fs');
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
        ]).then(r => {
            req._total_record(r)
            
            if(req.axios){
                res.json({r})
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


router.post('/img', function (req, res, next) {

    co(function* () {
        
        f = req.rename("files")
        
        for(i in f) {

            yield req.thumb(f[i].x, 100)
            yield req.thumb(f[i].x, 200)
        }
        
        
        var unlink = req._array(req.body.unlink)
        var old_name = req._array(req.body.old_name)
        var q = req._array(req.body.q)

//        console.log(unlink);
//        console.log(old_name);
//        console.log(q);
        
        if(unlink.length) {
            for (i in unlink) {
                fs.unlink(req.UPLOAD_PATH + unlink[i], err => {if (err) throw err})
                fs.unlink(req.UPLOAD_PATH + "thumb/100/" + unlink[i], err => {if (err) throw err})
                fs.unlink(req.UPLOAD_PATH + "thumb/200/" + unlink[i], err => {if (err) throw err})
            } 
        }
        
        var imgs = []
        
        if(q.length) {
            for (i in q) {
                if(q[i] == "_new") {
                    imgs[i] = f.shift().new_name
                } else {
                    imgs[i] = old_name.shift()
                }
            }
        }

        yield req.mquery('_product_update_imgs', [req.body.idx, imgs.join()])
        
        res.redirect(req.get('referer'))
        
    }).catch(err => console.log(err))
    
})

module.exports = router;
