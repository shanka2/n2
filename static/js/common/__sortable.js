Vue.component("sortable", {
    template: `
        <span>
            <draggable :element="'ul'" :list="items">
                <li v-for="(item,i) in items">
                    <span v-if="opened" @click="item.opened = item.opened * -1">-</span>
                    <span v-show="!item.ic" @dblclick="_edit_mode(i)">{{item.name}}</span>
                    <input ref="name" v-show="item.ic" :value="item.name" @keypress.enter="_edit(i)" @keyup.esc="item.ic = false" @blur="item.ic = false">
                    <input ref="link" v-if="dd && link" v-model="item.link">
                    <input ref="setting" v-if="dd && setting" v-model="item.setting">
                    <button @click="_del(i)">-</button>
                    <span v-if="item.cnt">({{item.cnt}})</span>
                    <sortable :items="item.items" :depth="depth-1" :dd="depth" :link="link" :setting="setting" v-if="(depth || 0)>1" v-show="item.opened>0"></sortable>
                    <br>
                </li>
            </draggable>
            <input @keypress.enter="_add">
        </span>
    `,

    props: ['items', 'depth', 'opened', 'dd', 'link', 'setting'],

    methods: {
        _add() {
            if (!_.where(this.items, {
                    name: event.target.value
                }).length) {
                this.items.push({
                    name: event.target.value,
                    items: [],
                    ic: false,
                    opened: 1
                })
                event.target.value = ""

            }
        },

        _del(i) {
            if (this.items[i].cnt) return;
            this.items.splice(i, 1)
        },

        _edit_mode(i) {
            this.items[i].ic = true
            Vue.nextTick(() => this.$refs["name"][i].select())
        },

        _edit(i) {
            if (!_.where(this.items, {name: event.target.value}).length) {
                this.items[i].name = event.target.value
                this.items[i].ic = false
            }
        },
    }
})
                
                
                
                
                
                
                