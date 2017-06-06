var _ = require('underscore');
var fs = require('fs');
var im = require('imagemagick')

module.exports = (app) => (req, res, next) => {
    
    req.UPLOAD_PATH = app.locals.UPLOAD_PATH
    req.db = app.locals.db;
    req.ObjectId = app.locals.ObjectId;

    req.axios = req.headers['auth-token'] == "axios"
    
    req.s_value = req.query.s_value || null
    req.page_size = req.query.page_size == 'ALL' ? 100000000 : (req.query.page_size || 10);
    req.prev_size = req.page_size * ((req.query.now_page || 1) - 1);
    
    req.connection = app.locals.connection;

    req.mquery = (query, param) => new Promise((resolve, reject) => {

        req.connection.query('call ' + query + '(' + param.map(p => '?').join() + ')', param, function (err, rows, fields) {
            if (err) throw err;
            
            resolve(req._r(rows[0] || []))

        });
    })

    req.thumb = (file_path, new_size) => new Promise((resolve, reject) => {
        
        im.resize({
            srcPath: file_path,
            dstPath: file_path.replace('upload/','upload/thumb/' + new_size + '/'),
            width: new_size
        }, function (err, stdout, stderr) {
            if (err) throw err;
            
            resolve()
        });    
        
    })
    
    req.rename = (name) => {
        var f = req[name]
        
        for(i in f) {
            f[i].new_name = f[i].filename + '_' + f[i].originalname
            f[i].x = f[i].destination + f[i].new_name
            fs.rename(f[i].path, f[i].x)
        }
        
        return f;
    }
    
    req._array = (x) => typeof x == "string" ? [x] : (x || [])
    
    app.locals.$$ = {
        title: "express study",
        qs: req.query,
        _path: (path) => (x) => {
            var m = path.substr(path.indexOf('views') + 'views'.length)
            var p = m.split('/')
            var f = p.reverse()[0]
            return "/" + x + m.replace(f, "__" + f.replace(".ejs", "." + x))
        },
        r: [],
        total_record: 0,
        page_size: req.query.page_size || 10,
        now_page: req.query.now_page || 1
    }
        
    req._r = (x) => {
        app.locals.$$.total_record = x.length ? (x[0].total_record || 0) : 0
        app.locals.$$.r = x
        return app.locals.$$
    }
    

    req._table = () => {
        var x;
        if(req.originalUrl.indexOf("category") > -1) x = "_category";
        if(req.originalUrl.indexOf("event") > -1) x = "_event";
        if(req.originalUrl.indexOf("menu") > -1) x = "_menu";
        if(req.originalUrl.indexOf("board_id") > -1) x = "_board_id";
        if(req.originalUrl.indexOf("setting") > -1) x = "_setting";    
        return x
    }
    
    
    next()
}
