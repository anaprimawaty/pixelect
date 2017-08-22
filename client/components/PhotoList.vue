<template>
  <div class="columns is-mobile is-multiline">
    <div v-for="photo in photos" :key="photo.url" class="column is-narrow">
      <photo :url="photo.url" :voted="photo.voted" :votes="photo.votes"/>
    </div>
  </div>
</template>

<script>
import Photo from '@/components/Photo'

export default {
  props: ['photos'],
  components: { Photo },
}
</script>

<style scoped>
</style>
