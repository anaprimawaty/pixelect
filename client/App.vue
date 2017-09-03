<template>
  <main v-if="isLoggedIn === null">
    <loading />
  </main>
  <main v-else-if="isLoggedIn">
    <router-view></router-view>
  </main>
  <login v-else/>
</template>

<script>
import { mapState } from 'vuex'
import Login from '@/views/Login'
import Loading from '@/views/Loading'
import store from '@/store'

export default {
  computed: mapState({
    isLoggedIn: state =>
      state.facebookId == null ? null : state.facebookId !== 0,
  }),
  components: {
    Login,
    Loading,
  },
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #404040;
}

html {
  background: #f4f4f4;
  overflow-x: hidden;
}

.loading-overlay, .loading-background {
  background: #f4f4f4 !important;
}

</style>
