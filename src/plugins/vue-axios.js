import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { EventBus } from './event-bus'
import { LOADER_EVENT, KEY, STORAGE_KEY } from '@/helpers/constants'
import Auth from '@/store/plugins/auth'
import Forum from '@/store/plugins/forum'

Vue.use(VueAxios, { 
  auth: axios.create({ }),
  forums: axios.create({ })
})

const loader = loading => {
  EventBus.$emit(LOADER_EVENT, loading)
}

Vue.use(Auth, { key: KEY, loader })
Vue.use(Forum, { storageKey: STORAGE_KEY, key: KEY, loader })
