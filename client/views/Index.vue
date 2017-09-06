<template>
  <div>
    <div class="container">
      <section class="section">
      <transition-group name="slide-fade">
        <div class="box is-paddingless" v-for="group in groups" :key="group.hash">
          <router-link :to="`/group/${group.hash}`">
            <div class="cover-image" :style="{ 'background-image': `url(${group.link})` }" />
            <div class="group-details">
              <span class="group-name">{{ group.name }}</span>
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
.box {
  position: relative;
  overflow: hidden;
}

.cover-image {
	width: 100%;
	height: 400px;
	background-position: 50% 50%;
	background-size: cover;
  filter: blur(10px);
}

.box:hover .cover-image {
}

.group-details {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  transition: all 0.3s;
}

.box:hover .group-details {
  background: rgba(0, 0, 0, 0.2);
}

.group-name {
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
}
</style>
