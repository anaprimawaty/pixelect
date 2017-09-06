<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <router-link class="navbar-item" @click="menu = false" to="/"><img id="logo-pic" src="/assets/logo.png"><strong id="logo-text">Pixelect</strong></router-link>

        <div :class="`navbar-burger${ menu ? ' is-active' : '' }`" @click="menu = !menu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div :class="`navbar-menu${ menu ? ' is-active' : '' }`">

        <div class="navbar-end">

          <div class="navbar-item">
            <div class="field is-grouped">
              <p v-for="button in buttons" class="control">
                <button :class="button.class" @click="bus.$emit(button.action)">{{ button.text }}</button>
              </p>
            </div>
          </div>

          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link plain-navbar-dropdown">
            </a>
            <div class="navbar-dropdown is-right">
              <div class="navbar-item">
                <div class="level">
                  <div class="level-left">
                    <div class="level-item">
                      <strong>Welcome Back, {{userName}}! </strong>
                    </div>
                  </div>
                  <div class="level-right">
                    <div class="level-item">
                      <span class="icon has-text-info" style="margin-left:0.3rem">
                        <img src="/assets/partyPopper.png">
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="navbar-divider">
              </div>
              <div class="navbar-item">
                <iframe src="https://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fpixelect.me&width=250&layout=standard&action=like&size=small&show_faces=true&share=true&height=80&appId=2034722683480772" width="250" height="60" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>
              </div>
              <div class="navbar-divider">
              </div>
              <a class="navbar-item" @click="logout">
                Logout
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
import store from '@/store'
import bus from '@/bus'

export default {
  data() {
    return {
      menu: false,
      bus,
    }
  },
  computed: {
    ...mapState({
      userName: state => state.userName,
    }),
    buttons: function() {
      switch (this.$route.name) {
        case 'index':
          return [
            {
              text: 'Create Group',
              class: 'button is-primary',
              action: 'createGroup',
            },
          ]
        case 'group':
          return [
            { text: 'Publish', class: 'button is-primary', action: 'publish' },
            { text: 'Invite', class: 'button is-primary', action: 'invite' },
          ]
      }
    },
  },
  methods: {
    logout: function() {
      FB.logout(function(response) {
        window.location.reload()
      })
    },
  },
}
</script>

<style scoped>
nav {
  box-shadow: rgba(0, 0, 0, 0.5) 0 0 5px;
  z-index: 1000; /* loader has z-index: 999; */
}

/* We can photoshop our own Logo + Text if we don't like these */
#logo-text {
  padding-left: 0.60rem;
  font-size: 1.4rem;
}

#logo-pic {
  height: 2.3rem;
  width: 2.3rem;
  max-height: 2.5rem;
}

@media screen and (min-width: 1008px) {
  .plain-navbar-dropdown::after {
    right: 1.40rem;
  }
}
</style>
