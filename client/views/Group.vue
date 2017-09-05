<template>
  <transition name="slide-fade">
    <div v-if="isGroupValid == null">
      <loading />
    </div>
    <div v-else-if="isGroupValid">
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
          <div class="group-link">
            <a :href="link" @click="copyLink">{{ link }}</a>
            <span class="icon action" @click="copyLink">
              <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                <path fill="#a0a0a0" d="M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z" />
              </svg>
            </span>
            <span class="icon action" @click="shareLink">
              <svg style="width:28px;height:28px;margin-top:-2px" viewBox="0 0 512 512">
                <path fill="#a0a0a0" d="M211.9 197.4h-36.7v59.9h36.7V433.1h70.5V256.5h49.2l5.2-59.1h-54.4c0 0 0-22.1 0-33.7 0-13.9 2.8-19.5 16.3-19.5 10.9 0 38.2 0 38.2 0V82.9c0 0-40.2 0-48.8 0 -52.5 0-76.1 23.1-76.1 67.3C211.9 188.8 211.9 197.4 211.9 197.4z" />
              </svg>
            </span>
            <input ref="link" :value="link" />
          </div>
          <transition name="fade" mode="out-in">
            <preview
              v-show="preview != null"
              :photo-id="preview && preview.photoId"
              :link="preview && preview.link"
              :voted="preview && preview.voted"
            />
          </transition>
          <dropzone :group-id="groupId" />
          <photo-list :photos="photos" />
        </section>
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
import Preview from '@/components/Preview'
import Dropzone from '@/components/Dropzone'
import CustomFooter from '@/components/CustomFooter'

export default {
  mounted() {
    store.dispatch(FETCH_GROUP, this.groupId)

    const payload = { facebookId: this.facebookId, groupHash: this.groupId }
    fetch('/groups/addUser', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(payload),
      credentials: 'same-origin',
    })
  },
  created() {
    bus.$on('publish', function() {
      console.log('Publish')
    })
    bus.$on('invite', function() {
      console.log('Invite')
    })
  },
  destroyed() {
    bus.$off('publish')
    bus.$off('invite')
  },
  beforeUpdate: function() {
    if (this.name === null) {
      this.name = store.state.groupName
    }
  },
  data() {
    return {
      name: null,
      selected: null,
    }
  },
  props: ['groupId'],
  computed: {
    ...mapState({
      facebookId: state => state.facebookId,
      isGroupValid: state => state.isGroupValid,
      photos: state => state.photos,
      users: state => state.users,
      preview: state => state.preview,
      link: function(state) {
        return `${window.location.origin}/#/group/${this
          .groupId}/${state.groupName.toLowerCase().replace(/ /g, '-')}`
      },
    }),
  },
  components: {
    NotFound,
    PhotoList,
    Preview,
    Dropzone,
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

.group-link a {
  color: #a0a0a0;
  text-decoration: none;
  border-bottom: 1px dashed #a0a0a0;
}

.group-link input {
  width: 1em;
  height: 1em;
  padding: 0;
  opacity: 0;
}

.action {
  cursor: pointer;
}

.group-link {
  margin-bottom: 1.5em;
}

.user-list {
  position: relative;
}

.fade-enter-active, .fade-leave-active {
  transition: all .25s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
