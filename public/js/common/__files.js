Vue.component("files", {
    template: `
        <div>
            <input type="file" multiple @change="_preview" id="_f">
            <button @click="_reset" v-if="hasOwnResetBtn">reset</button>

            <draggable :list="files">
            <div v-for="f in files" class="_files" :class="{_del:f.del, _isNew:f.file}">
                <div><img :src="f.url" :alt="f.name">{{f.name}}</div>
                <div><input type="checkbox" v-model="f.del"></div>
            </div>
            </draggable>
        </div>
    `,
    
    props: ['hasOwnResetBtn'],
    
    data() {
        return {
            files: [],
        }
    },

    created () {
        Event.$on("_reset", () => this._reset())
        Event.$on("_select", x => this._select(x.imgs))
        Event.$on("_upload", x => this._upload(x.idx))
    },
    
    methods: {
        
        _reset () {
            this.files = []
            document.getElementById('_f').value = ''
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
                    Event.$emit("_reload_data", {r: x.data.r})
                })
        },
                
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
        
        _select (imgs) {
            
            var files = []
            
            if(imgs) {
                var z = imgs.split(",")
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
        
    }
})