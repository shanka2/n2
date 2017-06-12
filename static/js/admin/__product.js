
var vue = new Vue({
    el: "#_root",
    data: {
        x: $$,
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
    },

    created() {
        
        this.form_d = _.clone(this.form)
        
        Event.$on("_reload_data", x => {
            this.x = x.r
            this._reset()
        })
        
        Event.$on("_exec", x => {
            this._exec(x.action)
        })
        
        Event.$on("_reset", x => {
            this._reset()
        })

    },

    computed: {
        isDirtyForm () {
            return !_.isEqual(this.form, this.form_d)
        }
    },

    methods: {
          
        _reset () {
            this.form = _.clone(this.form_d)
            Event.$emit("_reset_files")
        },
        
        _exec(action) {
            var z = this
            axios.post(__pathname + action, z.form).then(x => Event.$emit("_upload", {idx: x.data.idx}))
        },

        _select(idx) {
            var d = _.where(this.x.r,{idx})
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
            
            Event.$emit("_select", {imgs: d[0].imgs})
            Event.$emit("_modal_open")
            
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
