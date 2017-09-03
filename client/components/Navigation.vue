<template>
  <nav class="navbar is-transparent">
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
                <button :class="button.class" @click="$emit(button.action)">{{ button.text }}</button>
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
              <a class="navbar-item">
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

export default {
  props: ['buttons'],
  data() {
    return {
      menu: false,
    }
  },
  computed: mapState({
    userName: state => state.userName,
  }),
}
</script>

<style scoped>
nav {
  box-shadow: rgba(0, 0, 0, 0.5) 0 0 5px;
  margin-bottom: 2em;
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
