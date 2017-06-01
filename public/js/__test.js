window.Event = new Vue()

var vue = new Vue({
    el: "#_root",
    data: {
        x: $$,
        form: {
            idx: "",
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
            
            Event.$emit("_select", {imgs: d[0].imgs})
            
        },

    }
})
