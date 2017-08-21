<template>
  <div>
    <span>{{ name }}</span>
    <div class="columns is-mobile is-multiline is-centered">
      <div v-for="photo in photos" :key="photo.url" class="column is-narrow">
        <photo :url="photo.url" :votes="photo.votes"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import store, { ADD_GROUP } from '@/store'
import Photo from '@/components/Photo'

export default {
  mounted: function() {
    fetch('/mocks/group.json')
      .then(response => response.json())
      .then(json => store.dispatch(ADD_GROUP, { groupId: 'a', group: json }))
  },
  props: ['groupId'],
  data() {
    return {}
  },
  computed: {
    name() {
      return this.groupId in store.state.groups
        ? store.state.groups[this.groupId].name
        : ''
    },
    photos() {
      return this.groupId in store.state.groups
        ? store.state.groups[this.groupId].photos
        : []
    },
  },
  components: {
    photo: Photo,
  },
  // computed: mapState({
  //   name: state =>
  //     this.groupId in state.groups ? state.groups[this.groupId].name : '',
  //   photos: state =>
  //     this.groupId in state.groups ? state.groups[this.groupId].photos : [],
  // }),
  methods: {},
}
</script>

<style scoped>
</style>
