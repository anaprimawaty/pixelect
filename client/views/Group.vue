<template>
  <transition name="slide-fade">
    <loading v-if="isGroupValid == null" />
    <div v-else-if="isGroupValid">
      <b-loading :active="isUploading" />
      <div class="container">
        <section class="section">
          <div class="user-list">
            <user-list :users="users" />
          </div>
          <div class="group-title">
            <span class="title" contenteditable="true" @keydown="nameKeydown" @input="nameUpdate">{{ name }}</span>
            <span class="icon">
              <svg style="width:32px;height:32px;margin-bottom:12px" viewBox="0 0 24 24">
                <path fill="#a0a0a0" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
              </svg>
            </span>
          </div>
          <photo-list :photos="photos" :group-id="groupId" />
        </section>
        <div class="modal is-active" v-if="modal === 'publish'">
          <div class="modal-background" @click="modal = null"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Publish to Facebook?</p>
            </header>
            <section class="modal-card-body">
              <p>Pixelect uploads the best photos to Facebook for you.</p>
              <br>
              <p>Album name: </p>
              <p class="modal-body-indent">{{name}}</p>
              <br>
              <p>Number of Photos: </p>
              <p class="modal-body-indent">{{Object.keys(photos).length}}</p>
            </section>
            <footer class="modal-card-foot">
              <button class="button" @click="modal = null">
                Cancel
              </button>
              <button class="button is-primary" @click="publishGroup">
                <img class="fb-logo" src="/assets/FB_logo.png" />
                Upload to Facebook
              </button>
            </footer>
          </div>
        </div>
        <div class="modal is-active" v-if="modal === 'invite'">
          <div class="modal-background" @click="modal = null"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Invite friends to {{name}}!</p>
            </header>
            <section class="modal-card-body">
              <p class="has-text-centered">Share this link directly:</p>
              <input class="input-link invite-body-item" ref="link" readonly="readonly" :value="link" @click="copyLink" />
              <hr>
              <p class="has-text-centered"> or Share via:</p>
              <div class="has-text-centered invite-body-item">
                <button class="button is-primary" @click="shareLink">
                  <img class="fb-logo" src="/assets/FB_logo.png"/>
                  Message
                </button>
              </div>
            </section>
            <footer class="modal-card-foot">
              <button class="button" @click="modal = null">
                Cancel
              </button>
            </footer>
          </div>
        </div>
      </div>
      <custom-footer />
    </div>
    <div v-else>
      <not-found />
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import store, { FETCH_GROUP, UPDATE_GROUP_NAME } from '@/store'
import bus from '@/bus'
import NotFound from '@/views/NotFound'
import Loading from '@/views/Loading'
import PhotoList from '@/components/PhotoList'
import UserList from '@/components/UserList'
import CustomFooter from '@/components/CustomFooter'

export default {
  mounted() {
    store.dispatch(FETCH_GROUP, this.groupId)
    this.name = this.groupName
  },
  created() {
    bus.$on('publish', () => {
      this.modal = 'publish'
    })
    bus.$on('invite', () => {
      this.modal = 'invite'
    })
  },
  destroyed() {
    bus.$off('publish')
    bus.$off('invite')
  },
  beforeUpdate: function() {
    if (this.name == null && this.isGroupValid) {
      this.name = store.state.groupName

      const payload = {
        facebookId: this.facebookId,
        groupHash: this.groupId,
        _csrf: store.state._csrf,
      }
      fetch('/groups/addUser', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
      })
    }
  },
  data() {
    return {
      name: null,
      selected: null,
      modal: null,
      isUploading: false,
    }
  },
  props: ['groupId'],
  computed: {
    ...mapState({
      facebookId: state => state.facebookId,
      isGroupValid: state => state.isGroupValid,
      photos: state => state.photos,
      users: state => state.users,
      link: function(state) {
        return `${window.location.origin}/#/group/${this.groupId}/`
      },
    }),
  },
  components: {
    NotFound,
    PhotoList,
    UserList,
    Loading,
    CustomFooter,
  },
  methods: {
    nameKeydown(e) {
      if (e.which === 13) {
        e.preventDefault()
        return false
      }
    },
    nameUpdate(e) {
      const name = e.target.innerText.replace(/\r?\n|\r/g, '')
      if (name !== e.target.innerText) {
        e.target.innerText = name
      }
      store.dispatch(UPDATE_GROUP_NAME, { groupId: this.groupId, name })
    },
    shareLink(e) {
      FB.ui({
        method: 'send',
        link: this.$refs.link.value,
      })
    },
    copyLink(e) {
      this.$refs.link.select()
      let successful = false
      try {
        successful = document.execCommand('copy')
      } catch (err) {}
      if (!successful) {
        prompt('Copy this link', this.$refs.link.value)
      } else {
        this.$toast.open({
          message: 'Copied link!',
          type: 'is-success',
        })
      }
    },
    publishGroup() {
      this.isUploading = true
      this.modal = null

      FB.api(
        `/${this.facebookId}/albums`,
        'post',
        {
          contributors: this.users.map(user => user.facebookId),
          make_shared_album: true,
          message: 'Uploaded with Pixelect',
          name: this.name,
        },
        response => {
          const albumId = response.id
          const asyncBatch = Object.values(this.photos).map(photo => ({
            method: 'post',
            relative_url: `/${albumId}/photos`,
            body: `url=${photo.link}`,
          }))
          FB.api('/', 'post', { batch: asyncBatch }, () => {
            this.isUploading = false
            this.$toast.open({
              message: 'Published to Facebook!',
              type: 'is-success',
            })
            window.location = `https://www.facebook.com/media/set/?set=a.${albumId}&type=3`
            // FB.ui(
            //   {
            //     method: 'send',
            //     to: this.users
            //       .map(user => user.facebookId)
            //       .filter(id => id !== this.facebookId),
            //     link: `https://www.facebook.com/media/set/?set=a.${albumId}&type=3`,
            //   }
            //   ret => {
            //     // ret == null if they cancel the dialog, so we redirect them
            //     if (ret == null) {
            //       window.open(
            //         `https://www.facebook.com/media/set/?set=a.${albumId}&type=3`
            //       )
            //     }
            //   }
            // )
          })
        }
      )
    },
  },
}
</script>

<style scoped>
[contenteditable]:focus {
  outline: none;
}

.group-title .title {
  padding: 3px;
  display: inline-block;
  border-bottom: 1px dashed #404040;
}

.action {
  cursor: pointer;
}

.user-list {
  position: relative;
}

.invite-body-item {
  margin: 0.7rem 0rem 0.8rem 0rem;
}

.fb-logo {
  height: 1.2rem;
  margin-right: 0.6rem;
}

.input-link {
  width: 100%;
  font-size: 0.85rem;
  border-radius: 1px;
  border: 1px solid #d9d9d9;
  height: 1.7rem;
  color: #555;
  text-align: center;
}
</style>
