import Vue from 'vue'
import Buefy from 'buefy'
import App from '@/App'
import router from '@/router'
import store from '@/store'

import 'babel-polyfill'
import 'whatwg-fetch'

import 'buefy/lib/buefy.css'

Vue.use(Buefy)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
})
