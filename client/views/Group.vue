<template>
  <div class="container">
    <div class="group-title">
      <span class="title" contenteditable="true" @keydown="nameKeydown" @input="nameUpdate">{{ name }}</span>
      <b-icon icon="pencil" pack="fa" class="is-medium" />
    </div>
    <photo-list :photos="photos"/>
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
  computed: mapState({
    photos: state => (state.group ? state.group.photos : []),
  }),
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

.group-title .icon {
  color: #a0a0a0;
  margin-bottom: 10px;
  }
</style>
