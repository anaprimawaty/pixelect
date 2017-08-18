import Vue from 'vue'
import Buefy from 'buefy'
import App from '@/components/App'
import router from '@/router'

import 'buefy/lib/buefy.css'

Vue.use(Buefy)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
})
