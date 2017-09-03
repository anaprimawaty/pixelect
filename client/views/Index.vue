<template>
  <div class="container">
    <section class="section">
    <transition-group name="slide-fade">
      <div class="card" v-for="group in groups" :key="group.hash">
        <router-link :to="`/group/${group.hash}`">
          <div class="card-image" style="background-image: url(https://s3-ap-southeast-1.amazonaws.com/pixelectstaging/c23eef979bff27aa896f49095c99bfa1)" />
          <div class="card-content">
            {{ group.name }}
          </div>
        </router-link>
      </div>
    </transition-group>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import router from '@/router'
import store, { FETCH_GROUP_LIST } from '@/store'
import bus from '@/bus'

export default {
  mounted() {
    store.dispatch(FETCH_GROUP_LIST)
  },
  created() {
    bus.$on('createGroup', function() {
      fetch('/groups', { method: 'POST' })
        .then(response => {
          if (!response.ok) {
            throw new Error()
          }
          return response.json()
        })
        .then(json => router.push(`/group/${json.Success}`))
    })
  },
  destroyed() {
    bus.$off('createGroup')
  },
  computed: mapState({
    groups: state => state.groups,
  }),
}
</script>

<style scoped>
.card {
	margin-bottom: 2em;
}

.card-image {
	width: 100%;
	height: 400px;
	background-position: 50% 50%;
	background-size: cover;
}
</style>
