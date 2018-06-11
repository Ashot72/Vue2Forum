import Vue from 'vue'
import VueAxios from 'vue-axios'

const API_URL = 'https://www.googleapis.com/identitytoolkit'
const SIGNUP_URL = '/v3/relyingparty/signupNewUser'
const SIGNIN_URL = '/v3/relyingparty/verifyPassword'

export default {
  install (Vue, { key, loader }) {   
    Vue.axios.auth.defaults.baseURL = API_URL
    this.key = key

    Vue.axios.auth.interceptors.request.use(config => {       
      loader(true)
      return config        
    })
    Vue.axios.auth.interceptors.response.use(res => {       
      loader(false)
      return res
    }, e => {
      loader(false)  
      return Promise.reject(e)  
    })

    Vue.prototype.$auth = this
  },
  signup (email, password) {          
    return Vue.axios.auth.post(`${SIGNUP_URL}?key=${this.key}`, { email, password, returnSecureToken: true })
  },
  signin (email, password) {
    return Vue.axios.auth.post(`${SIGNIN_URL}?key=${this.key}`, { email, password, returnSecureToken: true })
  }
}
