<template>
  <main v-if="isLoggedIn === null">
    <b-loading :active="true" :canCancel="false" :style="{marginBottom: '150px'}"></b-loading>
  </main>
  <main v-else-if="isLoggedIn">
    <navigation/>
    <section class="section">
      <router-view></router-view>
    </section>
  </main>
  <login v-else/>
</template>

<script>
import { mapState } from 'vuex'
import Navigation from '@/components/Navigation'
import Login from '@/views/Login'
import store from '@/store'

export default {
  computed: mapState({
    isLoggedIn: state =>
      state.facebookId == null ? null : state.facebookId !== 0,
  }),
  components: {
    navigation: Navigation,
    login: Login,
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
</style>
