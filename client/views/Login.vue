<template>
  <div class="login">
    <video class="bg" preload="auto" autoplay="true" loop="loop" muted="muted" volume="0">
      <source src="/assets/bg.mp4" type="video/mp4" />
      <source src="/assets/bg.webm" type="video/webm" />
    </video>
    <section class="section">
      <div class="container has-text-centered">
          <img class="logo" src="/assets/logo.svg"/>
          <h1 class="title">Pixelect</h1>
          <h2 class="subtitle">Photo sharing made simple</h2>
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
import store, { LOGIN } from '@/store'

export default {
  data() {
    return {
      fbSignInParams: {
        scope: ['publish_actions', 'user_photos'],
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
        store.dispatch(LOGIN, { facebookId: dude.id, name: dude.name })
        fetch('/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            facebookId: dude.id,
            name: dude.name,
            _csrf: store.state._csrf,
          }),
          credentials: 'same-origin',
        })
      })
    },
    onSignInError(error) {
      console.log('OH NOES', error)
    },
  },
}
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-image: url(/assets/bg.png);
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: cover;
}

.logo {
  height: 300px;
  margin: 0 50px 50px 0;
}

.title, .subtitle, .description {
  color: #fff;
}

.title {
  font-size: 50px;
}

.description {
  font-weight: bold;
}

.fb-signin-button {
  /* This is where you control how the button looks. Be creative! */
  display: inline-block;
  padding: 10px 20px;
  border-radius: 3px;
  background-color: #4267b2;
  color: #fff;
  cursor: pointer;
  font-size: 20px;
  margin: 20px 0 50px 0;
}

.bg {
  display: none;
}

@media screen and (min-width: 900px) {
  .bg {
    display: block;
    position: fixed;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    z-index: 0;
    transform: translate(-50%, -50%);
    object-fit: cover;
  }
}
</style>
