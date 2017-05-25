
var vue = new Vue({
    el: "#_root",
    data: {
        x: $$,
        r: $$R,
        files: []
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
        
        _upload () {
            var z = this
            var data = new FormData()
            var f = z.files
            
            for(i in f) {
                data.append("files", f[i].file)
            }
            
            axios.post("/test", data, file_upload_config)
                .catch(err => console.log(err))
                .then(x => z.r = [...x.data.r])
            
            z._reset()
        },
        
        _reset () {
            this.files = []
            document.getElementById('_f').value = ''
        }
        
    }
})
