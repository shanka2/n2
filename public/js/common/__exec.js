Vue.component("exec", {
    template: `
        <div>
            <button @click="_reset" v-if="reset">reset</button>
            <button @click="_tableToExcel" v-if="excel">tableToExcel</button>
            <button @click="__exec('insert')">insert</button>
            <button @click="__exec('update')" v-if="idx">update</button>
            <button @click="__exec('delete')" v-if="idx">delete</button>
        </div>
    `,
    
    props: ['idx', 'reset', 'excel'],
    
    data: () => ({}),

    created () {
    },
    
    methods: {
        
        _tableToExcel () {
            tableToExcel(this.excel)
        },
        
        __exec (action) {
            Event.$emit("_exec", {action})
        },
        
        _reset () {
            Event.$emit("_reset", {})
        }
        
    }
})