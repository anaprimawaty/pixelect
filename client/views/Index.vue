<template>
  <div>
    <div class="container">
      <section class="section">
      <transition-group name="slide-fade">
        <div class="card" v-for="group in groups" :key="group.hash">
          <router-link :to="`/group/${group.hash}`">
            <div class="card-image" :style="{ 'background-image': `url(${group.link})` }" />
            <div class="card-content">
              {{ group.name }}
            </div>
          </router-link>
        </div>
      </transition-group>
      </section>
    </div>
    <custom-footer/>
  </div>

</template>

<script>
import { mapState } from 'vuex'
import router from '@/router'
import store, { FETCH_GROUP_LIST } from '@/store'
import bus from '@/bus'
import CustomFooter from '@/components/CustomFooter'

export default {
  mounted() {
    store.dispatch(FETCH_GROUP_LIST)
  },
  created() {
    bus.$on('createGroup', function() {
      fetch('/groups', { method: 'POST', credentials: 'same-origin' })
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
  components: {
    CustomFooter,
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
