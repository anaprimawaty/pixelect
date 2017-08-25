<template>
  <div :class="{ modal: true, 'is-active': this.link != null }" @keypress="close">
    <div class="modal-background" @click="close"></div>
    <div class="modal-content" @click="close">
      <div class="preview-image" :style="{ backgroundImage: `url(${link})` }" v-if="link"  />
    </div>
    <button class="modal-close is-large" @click="close" aria-label="close"></button>
  </div>
</template>

<script>
import store, { PREVIEW } from '@/store'

export default {
  props: ['link'],
  methods: {
    close(e) {
      console.log(e)
      store.commit(PREVIEW, null)
    },
  },
}
</script>

<style scoped>
.modal-content {
  width: calc(100vw - 120px);
  height: calc(100vh - 40px);
}

.preview-image {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  margin: auto;
  width: 100%;
  height: 100%;
}
</style>
