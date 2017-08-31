import Vue from 'vue'
import Buefy from 'buefy'
import Toasted from 'vue-toasted'
import VueProgressiveImage from 'vue-progressive-image'
import VueResize from 'vue-resize'
import FBSignInButton from 'vue-facebook-signin-button'
import App from '@/App'
import router from '@/router'
import store, { LOGIN } from '@/store'

import 'babel-polyfill'
import 'whatwg-fetch'

import 'buefy/lib/buefy.css'

Vue.use(Buefy)
Vue.use(Toasted)
Vue.use(VueProgressiveImage)
Vue.use(VueResize)
Vue.use(FBSignInButton)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  created: function() {
    window.fbAsyncInit = function() {
      // eslint-disable-next-line
      FB.init({
        appId: '2034722683480772',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.10',
        status: 'true',
      })
      // eslint-disable-next-line
      FB.AppEvents.logPageView()
      // eslint-disable-next-line
      FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          // eslint-disable-next-line
          FB.api('/me', function(response) {
            store.dispatch(LOGIN, {
              facebookId: response.id,
              name: response.name,
            })
            fetch('/users/loggedIn', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ facebookId: response.id }),
            })
            fetch('/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                facebookId: response.id,
                name: response.name,
              }),
            })
          })
        } else {
          store.dispatch(LOGIN, { facebookId: 0, name: '' })
        }
      })
    }

    // FB SDK
    ;(function(d, s, id) {
      var js
      var fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {
        return
      }
      js = d.createElement(s)
      js.id = id
      js.src = '//connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    })(document, 'script', 'facebook-jssdk')
  },
  router,
  store,
  template: '<App/>',
  components: { App },
})
