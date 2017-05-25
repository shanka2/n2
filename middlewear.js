var _ = require('underscore');
var fs = require('fs');
var im = require('imagemagick')

module.exports = (app) => (req, res, next) => {
    
    req.UPLOAD_PATH = app.locals.UPLOAD_PATH
    req.db = app.locals.db;
    req.ObjectId = app.locals.ObjectId;

    req.axios = req.headers['auth-token'] == "axios"
    
    req.s_value = req.query.s_value || null
    req.now_page = req.query.now_page || 1
    req.page_size = req.query.page_size == 'ALL' ? 100000000 : (req.query.page_size || 10);
    req.now_page_size = req.query.page_size || 10;
    req.prev_size = req.page_size * (req.now_page - 1);
    
    req.connection = app.locals.connection;

    req.mquery = (query, param) => new Promise((resolve, reject) => {

        req.connection.query('call ' + query + '(' + param.map(p => '?').join() + ')', param, function (err, rows, fields) {
            if (err) throw err;

            resolve(rows[0])

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
    
    app.locals.$$ = {
        title: "express study",
        sub_title: "less study",
        less: [
            'Getting Started',
            'Variables',
            'Mixins',
            'Nesting and Scope',
            'Operations',
            'Functions',
        ],
        qs: req.query,
        abcd: a => b => c => d => [a, b, c, d].join(" "),
        _path: (path) => (x) => {
            var m = path.substr(path.indexOf('views') + 'views'.length)
            var p = m.split('/')
            var f = p.reverse()[0]
            return "/" + x + m.replace(f, "__" + f.replace(".ejs", "." + x))
        },
        page_size: req.now_page_size,
        now_page: req.now_page
    }
    app.locals.r = ""
    
    next()
}
