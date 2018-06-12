import Vue from 'vue'
import '@/plugins/vuelidate'
import '@/plugins/bootstrap-vue'
import '@/plugins/vue-axios'
import '@/filters/date'
import { router, store } from '@/plugins/vue-router';
import App from '@/App.vue'

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
