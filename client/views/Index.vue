<template>
	<div>
		<navigation :buttons="[{ text: 'Create Group', class: 'button is-primary', action: 'createGroup'}]" @createGroup="createGroup" />
		<div class="container">
      <section class="section">
        <div class="card" v-for="group in groups">
          <router-link :to="`/group/${group.hash}`">
            <div class="card-image" style="background-image: url(https://s3-ap-southeast-1.amazonaws.com/pixelectstaging/c23eef979bff27aa896f49095c99bfa1)" />
            <div class="card-content">
              {{ group.name }}
            </div>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import router from '@/router'
import store, { FETCH_GROUP_LIST } from '@/store'
import Navigation from '@/components/Navigation'

export default {
  mounted() {
    store.dispatch(FETCH_GROUP_LIST)
  },
  computed: mapState({
    groups: state => state.groups,
  }),
  methods: {
    createGroup() {
      fetch('/groups', { method: 'POST' })
        .then(response => {
          if (!response.ok) {
            throw new Error()
          }
          return response.json()
        })
        .then(json => router.push(`/group/${json.Success}`))
    },
  },
  components: {
    Navigation,
  },
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
