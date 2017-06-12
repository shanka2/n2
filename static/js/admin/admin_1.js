new Vue({
    el: "#__top_1__left",
    
    data: {
        r: []
    },
    
    created () {
        
        Event.$on("_reset_menu", x => {
            this.r = x.r
            this._now_page_setting()
        })
        
        this._reset()
        
    },
    
    methods: {
        
        _reset () {
            var z = this;
            axios.get("/admin/menu").then(x => {
                z.r = x.data.r.r
                z._now_page_setting()
            })
        },
        
        _now_page_setting () {
            this.r.forEach(i => {
                if(("/admin" + i.link).split("?")[0] == window.location.pathname) Event.$emit("_now_page_setting", {i})
            })
        },
        
    },
    
})


new Vue({
    el: "#__top_1__head_1",
    
    data: {
        now_page: {}
    },
    
    created () {
        
        Event.$on("_now_page_setting", x => {
            this.now_page = x.i
        })
        
    },
    
    methods: {
        
    },
    
})



