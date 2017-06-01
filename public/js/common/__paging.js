Vue.component("paging", {
    template: `
        <span>
            <div v-if="x.r.length > 0 && n == undefined">
                <span v-if="$p.prev_page" @click="_page($p.prev_page)">prev</span>
                <span v-for="n in $p.now_block_size" :class="{_selected: (_page_no(n) == $p.now_page)}" @click='_page(_page_no(n))'> {{_page_no(n)}} </span>
                <span v-if="$p.next_page" @click="_page($p.next_page)">next</span>
                <select v-model="$p.page_size" @change="_page(1, $p.page_size)">
                    <option v-for="v in $p.page_size_list">{{v}}</option>
                </select>

                <!--
                {{$p.page_size}}
                <br><br>
                <div v-for="n in $p.now_page_size" v-if="_no(n-1) > 0">NO. {{_no(n-1)}}</div>
                -->
            </div>
            <div v-if="!x.r.length">
                <h1>no records</h1>
            </div>
            <span v-if="n != undefined">
                {{_no(n)}}
            </span>
        </span>
    `,
    
    props: ['x', 'n'],
    
    data () {
        return {$p: {}}     
    },
    
    created () {
        this._set()
        Event.$on("_reload_data", x => {
            this._set()
        })
    },
    
    methods: {
        
        _set() {
            this.$p = this._pagination(this.x.total_record, this.x.now_page, this.x.page_size);
        },

        _page(now_page, page_size) {
            if (page_size) {
                location.href = '?now_page=' + now_page + '&page_size=' + page_size + _query(['now_page', 'page_size'])
            } else {
                location.href = '?now_page=' + now_page + _query('now_page')
            }
        },
        
        _no(n) {
            return this.$p.total_record - (this.$p.now_page_size * (this.$p.now_page - 1)) - n
        },
        
        _page_no(n) {
            return this.$p.block_size * (this.$p.now_block - 1) + n
        },

        _pagination(total_record, now_page, page_size) {

            now_page = now_page || 1
            now_page_size = page_size == 'ALL' ? total_record : parseInt(page_size || 10)

            var block_size = 10
            var total_page = Math.ceil(total_record / now_page_size)
            var total_block = Math.ceil(total_page / block_size)
            var now_block = Math.ceil(now_page / block_size)

            var now_block_size = now_block != total_block ? block_size : total_page - ((now_block - 1) * block_size)
            var prev_page = now_block - 2 >= 0 ? (now_block - 2) * block_size + 1 : null
            var next_page = now_block != total_block ? now_block * block_size + 1 : null

            return {
                total_record,
                now_page,
                now_page_size,
                page_size,
                block_size,
                total_page,
                total_block,
                now_block,
                now_block_size,
                prev_page,
                next_page,
                page_size_list: [1, 2, 3, 5, 7, 10, 15, 20, 25, 30, 50, 100, 200, 300, 500, 1000, 'ALL']
            }
        }        
        
    }
    
})