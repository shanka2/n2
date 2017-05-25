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
        $p: {},
        s_value: "",
        files: []
    },

    created() {
        this._set()
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
                        type: f[n].type,
                        file: f[n],
                        url: e.target.result
                    }
                    next()
                    
                }
                
            }, (err)=>{
                
                z.files = [...files]
                
            })
        },
          
        _upload (idx) {
            var z = this
            var data = new FormData()
            var f = z.files
            
            for(i in f) {
                data.append("files", f[i].file)
            }
            data.append("idx", idx)
            
            axios.post(__pathname + "img", data, file_upload_config)
                .catch(err => console.log(err))
                .then(x => {
                    z.r = x.data.r
                    z._set()
                })
            
            z._reset()
        },
        
        _reset () {
            this.files = []
            document.getElementById('_f').value = ''
        },
      
        _set() {
            if (!_.isEmpty(this.r)) {
                this.$p = _pagination(this.r[0].total_record, this.x.now_page, this.x.page_size);
            }
        },
        
        _exec(action) {
            var z = this
            axios.post(__pathname + action, z.form).then(x => {
                
                if(action == 'insert') {
                    z._upload(x.data.idx)
                }
            })
        },

        _info(idx) {
            var a = _.where(this.r,{idx})
            var f = this.form
            f.idx = idx
            f.opt = []
            for (i in a) {
                f.name = a[i].name
                f.price = a[i].price
                f.description = a[i].description
                f.opt1_name = a[i].opt1_name || 'color'
                f.opt2_name = a[i].opt2_name || 'size'
                if(a[i].opt1){
                    f.opt.push({
                        opt1: a[i].opt1,
                        opt2: a[i].opt2
                    })
                }
            }
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

        _page(now_page, page_size) {
            if (page_size) {
                location.href = '?now_page=' + now_page + '&page_size=' + page_size + _query(['now_page', 'page_size'])
            } else {
                location.href = '?now_page=' + now_page + _query('now_page')
            }
        },

        _search(s_value) {
            location.href = '?s_value=' + s_value + _query(['now_page', 's_value'])
        },

    }
})
