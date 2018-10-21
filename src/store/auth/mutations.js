import { AUTHDATA, CLEARAUTHDATA } from './mutation-types'
import { router } from '@/plugins/vue-router'

export default {
  [AUTHDATA] (state, { idToken, refreshToken, email, expiresIn }) {
    state.idToken = idToken
    state.refreshToken = refreshToken
    state.email = email
    state.expiresIn = expiresIn
  },
  [CLEARAUTHDATA] (state) {
    state.idToken = null
    state.email = null
    state.refreshToken = null
    state.expiresIn = null
    router.replace('/')
  }
}
