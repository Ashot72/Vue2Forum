import Vue from 'vue'
import { AUTHDATA, CLEARAUTHDATA } from './mutation-types'
import { SIGNUP, SIGNIN, SIGNOUT, AUTOSIGNIN } from './action-types'
import { STORAGE_KEY } from '../../helpers/constants' 
import { FAILED } from '../../store'

let v = new Vue()

export default {
  [SIGNUP] ({ commit, dispatch }, { email, password }) {
    return v.$auth.signup(email, password)
      .then(({ data }) => commit(AUTHDATA, data))
      .then(() => v.$forums.addUser({ email }))
      .catch(e => dispatch(FAILED, e, { root: true }))    
  },
  [SIGNIN] ({ commit, dispatch }, { email, password }) {    
    return v.$auth.signin(email, password)
      .then(({ data }) => commit(AUTHDATA, data))
      .catch(e => dispatch(FAILED, e, { root: true }))    
  },
  [SIGNOUT] ({ commit }) {
    commit(CLEARAUTHDATA)
  },
  [AUTOSIGNIN] ({ commit }) {
    const storage = localStorage.getItem(STORAGE_KEY)
    if (storage) {
      const vueForum = JSON.parse(storage)
      commit(AUTHDATA, vueForum)
    }
  }  
}