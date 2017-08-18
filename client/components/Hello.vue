<template>
  <div>
    {{ counter }}
    <button v-on:click="increment">+</button>
  </div>
</template>

<script>
import store, { INCREMENT } from '@/store'

export default {
  data() {
    return {}
  },
  computed: {
    counter() {
      return store.state.counter
    },
  },
  methods: {
    increment() {
      store.dispatch(INCREMENT)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
