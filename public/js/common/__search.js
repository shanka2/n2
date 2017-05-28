Vue.component("search", {
    template: `
        <div>
            <input type="text" v-model='s_value' @keypress.enter='_search(s_value)'>
            <span @click="_search('')" v-if="v">{{v}}</span>
        </div>
    `,
    
    props: ['v'],
    
    data: () => ({s_value: ""}),

    created () {
    },
    
    methods: {
        
        _search(s_value) {
            location.href = '?s_value=' + s_value + _query(['now_page', 's_value'])
        },
        
    }
})