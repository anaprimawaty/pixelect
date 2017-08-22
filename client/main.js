import Vue from 'vue'
import Buefy from 'buefy'
import Toasted from 'vue-toasted'
import VueProgressiveImage from 'vue-progressive-image'
import VueResize from 'vue-resize'
import App from '@/App'
import router from '@/router'
import store from '@/store'

import 'babel-polyfill'
import 'whatwg-fetch'

import 'buefy/lib/buefy.css'

Vue.use(Buefy)
Vue.use(Toasted)
Vue.use(VueProgressiveImage)
Vue.use(VueResize)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
})
