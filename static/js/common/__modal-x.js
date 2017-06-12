Vue.component("modal-x", {
    template: `
        <div class="modal" :class="{'is-active': is_active}">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">{{title}}</p>
              <button class="delete" @click="is_active=false"></button>
            </header>
            <section class="modal-card-body">
                <slot name="body"></slot>
            </section>
            <footer class="modal-card-foot">
                <slot name="footer"></slot>
            </footer>
          </div>
        </div>
    `,
    
    created () {
        var z = this
        Event.$on("_modal_open", () => z.is_active = true)  
        Event.$on("_modal_close", () => z.is_active = false)  

        window.addEventListener('keydown', event => {
            if(event.keyCode == 27) {
                z.is_active = false
            }
        })
    },
    
    props: ['title'],
    
    data () {
        return {
            is_active: false
        }
    }
})