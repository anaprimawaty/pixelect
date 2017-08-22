import Vue from 'vue'
import Buefy from 'buefy'
import VueProgressiveImage from 'vue-progressive-image'
import App from '@/App'
import router from '@/router'
import store from '@/store'

import 'babel-polyfill'
import 'whatwg-fetch'

import 'buefy/lib/buefy.css'

Vue.use(Buefy)
Vue.use(VueProgressiveImage)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
})
