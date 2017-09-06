import Vue from 'vue'
import Buefy from 'buefy'
import VueProgressiveImage from 'vue-progressive-image'
import VueResize from 'vue-resize'
import FBSignInButton from 'vue-facebook-signin-button'
import App from '@/App'
import router from '@/router'
import store, { LOGIN } from '@/store'

import 'babel-polyfill'
import 'whatwg-fetch'

import 'buefy/lib/buefy.css'
import '../static/assets/facebook'

Vue.use(Buefy)
Vue.use(VueProgressiveImage)
Vue.use(VueResize)
Vue.use(FBSignInButton)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  created: function() {
    window.fbAsyncInit = function() {
      /* global FB */
      FB.init({
        appId: '2034722683480772',
        autoLogAppEvents: true,
        xfbml: true,
        cookie: true,
        version: 'v2.10',
        status: 'true',
      })
      FB.AppEvents.logPageView()
      FB.getLoginStatus(function(response) {
        if (response.status === 'connected' && response.authResponse != null) {
          FB.api('/me', function(dude) {
            fetch('/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                facebookId: dude.id,
                name: dude.name,
              }),
              credentials: 'same-origin',
            }).then(() =>
              store.dispatch(LOGIN, {
                facebookId: dude.id,
                name: dude.name,
              })
            )
          })
        } else {
          store.dispatch(LOGIN, { facebookId: 0, name: '' })
        }
      })
    }
  },
  router,
  store,
  template: '<App/>',
  components: { App },
})
