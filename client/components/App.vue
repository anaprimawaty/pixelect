<template>
  <main>
    <navigation/>
    <section class="section">
      <router-view></router-view>
    </section class="section">
  </main>
</template>

<script>
import Navigation from '@/components/Navigation'

export default {
  components: {
    navigation: Navigation,
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
