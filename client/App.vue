<template>
  <main v-if="isLoggedIn === null">
    <loading />
  </main>
  <main v-else-if="isLoggedIn">
    <navigation />
    <transition name="slide-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </main>
  <login v-else/>
</template>

<script>
import { mapState } from 'vuex'
import Login from '@/views/Login'
import Loading from '@/views/Loading'
import Navigation from '@/components/Navigation'
import store from '@/store'

export default {
  computed: mapState({
    isLoggedIn: state =>
      state.facebookId == null ? null : state.facebookId !== 0,
  }),
  components: {
    Login,
    Loading,
    Navigation,
  },
}
</script>

<style lang="scss">
@import "../node_modules/bulma/sass/utilities/initial-variables";

$family-serif: Helvetica, Arial, sans-serif;
$primary: #5e9eff;
$primary-invert: #fff;
$family-primary: $family-serif;

@import "../node_modules/bulma/bulma";

#app {
  text-align: center;
  color: #404040;
}

html {
  background: $white-ter;
  overflow-x: hidden;
}

.loading-overlay, .loading-background {
  background: $white-ter !important;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .25s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
