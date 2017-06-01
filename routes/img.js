var fs = require('fs');
var express = require('express');
var router = express.Router();
var co = require('co')

module.exports = (proc) => function (req, res, next) {

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

        yield req.mquery(proc, [req.body.idx, imgs.join()])
    
        next();
        
    }).catch(err => console.log(err))
}
