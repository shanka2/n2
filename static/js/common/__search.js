Vue.component("search", {
    template: `
        <div>
            <input v-model='s_value' @keypress.enter='_search(s_value)'>
            <span @click="_search('')" v-if="v">{{v}}</span>
        </div>
    `,
    
    data () {
        return {
            s_value: "",
            v: ""
        }   
    },

    created () {
        this.v = $$.qs.s_value
    },
    
    methods: {
        
        _search(s_value) {
            location.href = '?s_value=' + s_value + _query(['now_page', 's_value'])
        },
        
    }
})