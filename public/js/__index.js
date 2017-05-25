var vue = new Vue({
    el: "#_root",
    data: {
        x: $$,
        files: [],
        r: $$R
    },
    methods: {

        _upload_preview() {
            var z = this;
            var f = event.target.files;
            var files = [];

            z.files = [];

            async.times(f.length, (n, next) => {
                var reader = new FileReader()
                reader.onload = (e) => {
                    files[n] = {
                        name: f[n].name,
                        size: f[n].size,
                        type: f[n].type,
                        url: e.target.result,
                        file: f[n]
                    }
                    next()
                }
                reader.readAsDataURL(f[n])

            }, (e) => {
                z.files = [...files]
            })

        },

        _upload() {

            var z = this;

            var data = new FormData();

            for (i in this.files) {
                data.append('files', this.files[i].file);
            }

            z.files = []
            document.getElementById('_f').value = "";

            axios.post('/product/insert', data, file_upload_config)
                .catch(arr => {
                    console.log(err);
                })
                .then(r => {
                    z.r = [...r.data]
                })
        },
        
        _delete_item(id) {
            var z = this;
            
            axios.get('/product/delete/' + id)
                .catch(arr => {
                    console.log(err);
                })
                .then(r => {
                    z.r = [...r.data]
                })
        }
    }
})
