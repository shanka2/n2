Vue.component("exec", {
    template: `
        <div class="_com_exec">
            <span class="btn" @click="_reset" v-if="reset">reset</span>
            <span class="btn" @click="__exec('insert')">insert</span>
            <span class="btn" @click="__exec('update')" v-if="idx">update</span>
            <span class="btn" @click="__exec('delete')" v-if="idx">delete</span>
        </div>
    `,
    
    props: ['idx', 'reset'],
    
    methods: {
        
        __exec (action) {
            Event.$emit("_exec", {action})
            Event.$emit("_modal_close")
        },
        
        _reset () {
            Event.$emit("_reset", {})
            Event.$emit("_modal_close")
        }
        
    }
})