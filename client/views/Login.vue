<template>
  <div>
    <fb-signin-button
      :params="fbSignInParams"
      @success="onSignInSuccess"
      @error="onSignInError">
      Sign in with Facebook
    </fb-signin-button>
    <h1>Hi! {{myName}}</h1>
    <br>
    <h2>Access Token: {{accessToken}}</h2>
    <br>
    <h3>Login State: {{isLoggedIn}}</h3>
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
        this.myName = dude.name
        store.dispatch(SET_LOGIN_STATE, true)
      })
      FB.getLoginStatus(response => {
        if (response.status === 'connected') {
          this.accessToken = response.authResponse.accessToken
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
console.log(store.state.isLoggedIn)
</script>

<style>
.fb-signin-button {
  /* This is where you control how the button looks. Be creative! */
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #4267b2;
  color: #fff;
  cursor: pointer;
}
</style>