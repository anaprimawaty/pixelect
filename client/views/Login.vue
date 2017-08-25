<template>
  <div class="bg">
    <section class="section">
      <div class="container has-text-centered">
          <img :style="{height: '300px', paddingRight: '50px'}" src="/favicon.png"/>
          <h1 class="title" :style="{fontSize: '50px'}">Pixelect</h1>
          <fb-signin-button
            :params="fbSignInParams"
            @success="onSignInSuccess"
            @error="onSignInError">
            Sign in with Facebook
          </fb-signin-button>
      </div>
    </section>
  </div>
</template>

<script>
import store, { SET_LOGIN_STATE } from '@/store'

export default {
  data() {
    return {
      fbSignInParams: {
        scope: '',
        return_scopes: true,
      },
    }
  },
  computed: {
    isLoggedIn() {
      return store.state.isLoggedIn
    },
  },
  methods: {
    onSignInSuccess(response) {
      FB.api('/me', dude => {
        console.log(`Good to see you, ${dude.name}.`)
        store.dispatch(SET_LOGIN_STATE, true)
        fetch('/users', {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(dude),
        })
      })
      FB.getLoginStatus(response => {
        if (response.status === 'connected') {
          // this.accessToken = response.authResponse.accessToken
          console.log('successfully connected!')
          console.log(response)
        } else {
          console.log('failed to connect')
        }
      })
    },
    onSignInError(error) {
      console.log('OH NOES', error)
    },
  },
}
</script>

<style scoped>
.fb-signin-button {
  /* This is where you control how the button looks. Be creative! */
  display: inline-block;
  padding: 10px 20px;
  border-radius: 3px;
  background-color: #4267b2;
  color: #fff;
  cursor: pointer;
  font-size: 20px;
  margin-top:20px;
}

.bg {
  height: -webkit-fill-available;
  background-color: hsl(171, 100%, 41%);
}
</style>