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
  <main v-else>
    <section class="section">
      <login/>
    </section>
  </main>
</template>

<script>
import Navigation from '@/components/Navigation'
import Login from '@/views/Login'
import store from '@/store'

export default {
  computed: {
    isLoggedIn() {
      return store.state.isLoggedIn
    },
  },
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
