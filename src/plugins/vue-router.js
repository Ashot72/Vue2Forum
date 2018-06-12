import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '@/router/routes'
import store from '@/plugins/vuex'
import { AUTOSIGNIN } from '@/store/auth/action-types'
import { AUTH } from '@/store/auth/getter-types'

Vue.use(VueRouter)

const router = new VueRouter({
   mode: 'history',
   routes,   
   scrollBehavior (to, from, savedPosition) {
     let position = { x: 0, y: 0 }

     if (to.hash) {          
       position = { selector: to.hash }
     }

     if (savedPosition) {
       position = savedPosition
     }

     return new Promise((resolve, reject) => {
       setTimeout(() => resolve(position), 2000)
      })
   }
})

store.dispatch(`auth/${ AUTOSIGNIN }`)

router.beforeEach((to, from, next) => {
  if (to.query.e) { next() }
  else 
  {     
    if (to.matched.some(record => record.meta.auth) && !store.getters[`auth/${ AUTH }`]) {    
      next({ name: 'forums', query: { e: 401 } })
    } else { next() }   
  }
})

export { store, router }

