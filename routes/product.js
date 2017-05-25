var fs = require('fs');
var express = require('express');
var router = express.Router();
var co = require('co')
var assert = require('assert')
var async = require('async')
var im = require('imagemagick')



router.post('/insert', function (req, res) {

    var imgs = []
    
    async.times(req.files.length, (i, next) => {
        
        var f = req.files[i];
        //        console.log(f);
        imgs[i] = f.filename + '_' + f.originalname
        fs.rename(f.path, f.destination + imgs[i])
        
//        console.log(f)

        im.resize({
            srcPath: f.destination + imgs[i],
            dstPath: f.destination + "thumb/" + imgs[i],
            width: 100
        }, function (err, stdout, stderr) {
            if (err) throw err;
            console.log('----------------------resized-------------------');
            
            next();
        });
        
    }, (err) => {
        if (err) throw err;

        co(function* () {
            var col = req.db.collection("product")

            var r = yield col.insert({
                img: imgs
            })
            assert.equal(1, r.insertedCount)

            var doc = yield col.find({}).toArray()

            res.json(doc)

        }).catch(err => {
            console.log(err);
        })
        
    })


});

router.get('/delete/:id', function (req, res, next) {

    co(function* () {
        var col = req.db.collection("product")
        var id = req.ObjectId

        var doc = (yield col.find({
            _id: id(req.params.id)
        }).toArray())[0]

        if (doc) {
            for (i in doc.img) {

                fs.unlink(req.UPLOAD_PATH + doc.img[i], err => {
                    if (err) throw err;
                })

                fs.unlink(req.UPLOAD_PATH + 'thumb/' + doc.img[i], err => {
                    if (err) throw err;
                })

            }
        }

        yield col.remove({
            _id: id(req.params.id)
        })

        doc = yield col.find({}).toArray()

        res.json(doc)

    }).catch(err => {
        console.log(err);
    })

});

module.exports = router;


/*
mongodb://shanka2x:byfor0104!@cluster0-shard-00-00-w6uwn.mongodb.net:27017,cluster0-shard-00-01-w6uwn.mongodb.net:27017,cluster0-shard-00-02-w6uwn.mongodb.net:27017/vue?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin
*/
