window.Event = new Vue()

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
            this.x.r = [...x.r]
            this._reset()
        })
    },

    methods: {
          
        _reset () {
            this.form = _.clone(this.form_d)
            Event.$emit("_reset")
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
