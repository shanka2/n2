var vue = new Vue({
    el: "#_root",
    data: {
        x: $$,
        items: [],
        items_d: []
    },

    mounted() {
        this._set()
        
        var z = this;
        window.addEventListener('keydown', event => {
            if(event.keyCode == 38 && event.altKey) {
                //up // closeAll
                z.items.forEach(i => i.opened = -1)
            } else if(event.keyCode == 40 && event.altKey) {
                //down // openAll
                z.items.forEach(i => i.opened = 1)
            } else if(event.keyCode == 83 && event.ctrlKey) {
                //save
                z._save()
            }
        })
    },

    computed: {
        _lists () {
            var x = []
            this.items.forEach((i, _i) => {
                x.push([
                    i.idx || "",
                    i.name,
                    "",
                    _i,
                    "",
                    i.opened
                ].join("^"))

                i.items.forEach((j, _j) => {
                    x.push([
                        j.idx || "",
                        i.name,
                        j.name,
                        _i,
                        _j
                    ].join("^"))
                })
            })

            return x.join("|")
        },

        _hasToUpdate () {
            return !_.isEqual(this.items, this.items_d)
        },

    },


    methods: {
        _save() {
            var z = this
            axios.post("/admin/category", {q: this._lists}).then(x => {
                z.x = x.data.r
                z._set()
            });
        },

        _set() {
            this._set_x(0)
            this._set_x(1)
        },

        _set_x (n) {
            var q = []
            this.x.r.forEach(i => {
                if (!i.c2) {
                    q.push({
                        idx: i.idx,
                        name: i.c1,
                        cnt: i.cnt,
                        opened: i.opened,
                        items: [],
                        ic: false
                    })
                } else {
                    _.where(q, {name: i.c1})[0].items.push({
                        idx: i.idx,
                        name: i.c2,
                        cnt: i.cnt,
                        items: [],
                        ic: false
                    })
                }
            })
            
            n == 0 ? this.items = q : this.items_d = q
        },
    },

})