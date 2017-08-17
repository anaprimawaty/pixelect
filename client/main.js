import Vue from 'vue'
import App from '@/components/App'
import router from '@/router'

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
})
