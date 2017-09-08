<template>
  <div>
    <loading v-if="groups == null" />
    <div v-else class="container">
      <section class="section">
      <transition-group name="slide-fade">
        <div class="box is-paddingless" v-for="group in groups" :key="group.hash">
          <router-link :to="`/group/${group.hash}`">
            <div
              class="cover-image"
              :style="group.link != '' ? { 'background-image': `url(${group.link})` } : { 'background': '#606060' }"
            ></div>
            <div class="group-details">
              <span class="group-name">{{ group.name }}</span>
            </div>
          </router-link>
          <a v-if="group.owner === facebookId" class="delete-button" @click="modal = true; groupHash = group.hash">
            <span class="material-icons">delete</span>
          </a>
        </div>
      </transition-group>
      </section>
    </div>
    <div class="modal is-active" v-if="modal">
      <div class="modal-background" @click="modal = false"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Delete Group?</p>
        </header>
        <section class="modal-card-body">
          <p>This will delete all photos in this group.</p>
        </section>
        <footer class="modal-card-foot">
          <button class="button" @click="modal = false">Cancel</button>
          <button class="button is-danger" @click="deleteGroup">Delete</button>
        </footer>
      </div>
    </div>
    <custom-footer/>
  </div>

</template>

<script>
import { mapState } from 'vuex'
import router from '@/router'
import store, { FETCH_GROUP_LIST, DELETE_GROUP } from '@/store'
import bus from '@/bus'
import CustomFooter from '@/components/CustomFooter'
import Loading from '@/views/Loading'

export default {
  mounted() {
    store.dispatch(FETCH_GROUP_LIST)
  },
  updated() {
    if (this.groups.length === 0) {
      this.createGroup()
    }
  },
  created() {
    bus.$on('createGroup', this.createGroup)
  },
  destroyed() {
    bus.$off('createGroup')
  },
  data() {
    return {
      groupHash: null,
      modal: false,
    }
  },
  computed: mapState({
    facebookId: state => state.facebookId,
    groups: state => state.groups,
  }),
  components: {
    CustomFooter,
    Loading,
  },
  methods: {
    createGroup() {
      fetch('/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${store.state.userName}'s Group`,
          _csrf: store.state._csrf,
        }),
        credentials: 'same-origin',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error()
          }
          return response.json()
        })
        .then(json => router.push(`/group/${json.Success}`))
    },
    deleteGroup() {
      this.modal = false

      const payload = {
        groupHash: this.groupHash,
        _csrf: store.state._csrf,
      }

      fetch('/groups/delete', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
      }).then(() => {
        store.dispatch(DELETE_GROUP, this.groupHash)
      })
    },
  },
}
</script>

<style scoped>
.box {
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.box:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
}

.cover-image {
	width: 100%;
	height: 400px;
	background-position: 50% 50%;
	background-size: cover;
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
  background: rgba(10, 10, 10, 0.1);
  transition: all 0.3s;
}

.delete-button {
  position: absolute;
  font-size: 1.5em;
  top: 0.5em;
  right: 0.5em;
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(10, 10, 10, 0.3);
  opacity: 0.5;
  transition: all 0.3s;
}

.delete-button:hover {
  transform: translateY(-1px);
  opacity: 1;
  text-shadow: 0 2px 5px rgba(10, 10, 10, 0.3);
}

.box:hover .group-details {
  background: rgba(10, 10, 10, 0.05);
}

.group-name {
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(10, 10, 10, 0.3);
}
</style>
