var vue = new Vue({
    el: "#_root",
    data: {
        x: $$,
        r: $$R,
        form: {
            idx: "",
            name: "",
            price: "",
            description: "",
            opt1_name: "color",
            opt2_name: "size",
            opt: []
        },
        form_d: {},
        files: [],
    },

    created() {
        this.form_d = _.clone(this.form)
    },

    methods: {
        
        _preview () {
            var z = this
            var f = event.target.files
            var files = []
            
            async.times(f.length, (n, next)=>{
                
                var reader = new FileReader()
                
                reader.readAsDataURL(f[n])
                
                reader.onload = (e) => {
                    
                    files[n] = {
                        name: f[n].name,
//                        type: f[n].type,
                        file: f[n],
                        url: e.target.result,
                        del: false
                    }
                    next()
                    
                }
                
            }, (err)=>{
                
                z.files = [...z.files, ...files]
                
            })
        },
          
        _upload (idx) {
            var z = this
            var data = new FormData()
            var f = z.files
            
            for(i in f) {
                if(f[i].old_name && f[i].del) data.append("unlink", f[i].old_name)
                if(f[i].old_name && !f[i].del) data.append("old_name", f[i].old_name)
                if(!f[i].del) data.append("q", f[i].file ? "_new" : "_old")
                if(f[i].file && !f[i].del) data.append("files", f[i].file)
            }
            data.append("idx", idx)
            
            axios.post(__pathname + "img", data, file_upload_config)
                .catch(err => console.log(err))
                .then(x => {
                    z.r = x.data.r
                })
            
            z._reset()
        },
        
        _reset () {
            this.files = []
            document.getElementById('_f').value = ''
            this.form = _.clone(this.form_d)
        },
        
        _exec(action) {
            var z = this
            axios.post(__pathname + action, z.form).then(x => z._upload(x.data.idx))
        },

        _select(idx) {
            var d = _.where(this.r,{idx})
            var f = this.form
            f.idx = idx
            f.opt = []
            for (i in d) {
                f.name = d[i].name
                f.price = d[i].price
                f.description = d[i].description
                f.opt1_name = d[i].opt1_name || 'color'
                f.opt2_name = d[i].opt2_name || 'size'
                if(d[i].opt1){
                    f.opt.push({
                        opt1: d[i].opt1,
                        opt2: d[i].opt2
                    })
                }
            }
            
            var files = []
            if(d[0].imgs) {
                var z = d[0].imgs.split(",")
                for (i in z) {
                    files[i] = {
                        name: z[i].substr(z[i].indexOf('_')+1),
                        old_name: z[i],
                        url: "/upload/thumb/100/" + z[i],
                        del: false
                    }
                }
            }
            this.files = [...files]
            
        },

        _opt_add() {
            this.form.opt.push({
                opt1: "",
                opt2: ""
            })
        },

        _opt_remove(k) {
            this.form.opt.splice(k, 1)
        },

    }
})
