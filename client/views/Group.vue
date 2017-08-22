<template>
  <div class="container">
    <div class="group-title">
      <span class="title" contenteditable="true" @keydown="nameKeydown" @input="nameUpdate">{{ name }}</span>
      <span class="icon">
        <svg style="width:32px;height:32px;margin-bottom:12px" viewBox="0 0 24 24">
          <path fill="#a0a0a0" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
        </svg>
      </span>
    </div>
    <div class="group-link">
      <a :href="link">{{ link }}</a>
      <span class="icon">
        <svg style="width:16px;height:16px" viewBox="0 0 24 24">
          <path fill="#a0a0a0" d="M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z" />
        </svg> 
      </span>
    </div>
    <photo-list :photos="photos" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import store, { FETCH_GROUP, UPDATE_GROUP_NAME } from '@/store'
import PhotoList from '@/components/PhotoList'

export default {
  mounted: function() {
    store.dispatch(FETCH_GROUP, this.groupId)
  },
  beforeUpdate: function() {
    if (this.name === '') {
      this.name = store.state.group ? store.state.group.name : ''
    }
  },
  data() {
    return {
      name: '',
    }
  },
  props: ['groupId'],
  computed: {
    ...mapState({
      photos: state => (state.group ? state.group.photos : []),
      link: function(state) {
        return `${window.location.origin}/#/group/${this.groupId}/${state.group
          ? state.group.name.toLowerCase().replace(/ /g, '-')
          : ''}`
      },
    }),
  },
  components: {
    PhotoList,
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
      store.dispatch(UPDATE_GROUP_NAME, name)
    },
  },
}
</script>

<style scoped>
.group-title .title {
  padding: 3px;
  display: inline-block;
  border-bottom: 1px dashed #404040;
}

.group-link a {
  color: #a0a0a0;
  text-decoration: none;
  Border-bottom: 1px dashed #a0a0a0;
}

.group-link {
  margin-bottom: 1em;
}
</style>
