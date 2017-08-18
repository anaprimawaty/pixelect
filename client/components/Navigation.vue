<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link class="navbar-item" @click="menu = false" to="/"><strong>Pixelect</strong></router-link>

    <div :class="`navbar-burger${ menu ? ' is-active' : '' }`" @click="menu = !menu">
      <span></span>
      <span></span>
      <span></span>
    </div>
    </div>

    <div :class="`navbar-menu${ menu ? ' is-active' : '' }`">
      <div class="navbar-start">
        <router-link class="navbar-item" @click="menu = false" to="/group/1">Sample Group</router-link>
        <router-link class="navbar-item" @click="menu = false" to="/user/1">Sample User</router-link>
      </div>

      <div class="navbar-end">
        <div class="navbar-item field">
          <button class="button">Login</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      menu: false,
    }
  },
}
</script>

<style scoped>
</style>
