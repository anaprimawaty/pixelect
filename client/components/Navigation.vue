<template>
  <nav class="navbar is-transparent">
    <div class="navbar-brand">
      <router-link class="navbar-item" @click="menu = false" to="/"><strong>Pixelect</strong></router-link>

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

        <div class="navbar-item">
          Welcome Back, {{userName}} !
        </div>

        <div class="navbar-item has-dropdown">
          <a class="navbar-link">
          </a>
          <div class="navbar-dropdown is-right">
            <a class="navbar-item">
              Logout
            </a>
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
</style>
