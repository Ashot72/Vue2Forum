import Vue from 'vue'
import Vuex from 'vuex'
import plugins from './auth/plugins'
import auth from './auth'
import forum from './forum'
import topic from './topic'
import post from './post'

import { CLEARAUTHDATA } from './auth/mutation-types'

export const FAILED = 'FAILED'
export const CLEARERROR = 'CLEARERROR'
export const FAILEDERROR = 'FAILEDERROR'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { error: '' },
  actions: {
    [FAILED] ({ commit }, error) {
      if (error === "signout") {   
        commit(`auth/${ CLEARAUTHDATA }`)
      } else {       
        commit(FAILEDERROR, error)            
      }
    },
  },
  mutations: {
    [CLEARERROR] (state) {
      state.error = '';
    },
    [FAILEDERROR] (state, error) {   
      state.error = `${ error.message || error }  
      ${ error.response ? (error.response.data.error.message || 
                           error.response.data.error ||  
                           error.response.data) : '' }`            
    },
  },   
  modules: { auth, forum, topic, post },
  plugins,
  strict: true
})
